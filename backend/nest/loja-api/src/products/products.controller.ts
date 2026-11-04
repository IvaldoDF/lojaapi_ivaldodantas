import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { createReadStream, existsSync } from 'fs';
import { basename, extname, join } from 'path';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os produtos' })
  @ApiResponse({ status: 200, description: 'Lista de produtos retornada com sucesso.' })
  findAll() {
    return this.productsService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar produto (ADMIN)' })
  @ApiResponse({ status: 201, description: 'Produto criado com sucesso.' })
  @ApiResponse({ 
    status: 400, 
    description: 'Erro de validação nos dados do produto.',
    schema: {
      example: {
        statusCode: 400,
        message: ['name must be a string', 'price must be a positive number'],
        error: 'Bad Request'
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Não autorizado (Token ausente ou inválido).' })
  @ApiResponse({ status: 403, description: 'Acesso negado (Papel insuficiente).' })
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar produto (ADMIN / MANAGER)' })
  @ApiResponse({ status: 200, description: 'Produto atualizado com sucesso.' })
  @ApiResponse({ 
    status: 400, 
    description: 'Erro de validação nos dados fornecidos.',
    schema: {
      example: {
        statusCode: 400,
        message: ['price must be a positive number'],
        error: 'Bad Request'
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  @ApiResponse({ status: 403, description: 'Acesso negado.' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @HttpCode(204)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remover produto (ADMIN)' })
  @ApiResponse({ status: 204, description: 'Produto removido com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  @ApiResponse({ status: 403, description: 'Acesso negado.' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }

  @Post(':id/image')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Fazer upload da imagem do produto (ADMIN)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Imagem enviada com sucesso.' })
  @ApiResponse({ status: 400, description: 'Arquivo ausente ou tipo inválido.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  @ApiResponse({ status: 403, description: 'Acesso negado.' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado.' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_req, file, cb) => {
          const safeBase = basename(file.originalname).replace(/\s+/g, '_');
          const ext = extname(safeBase) || '.bin';
          cb(null, `${Date.now()}-${safeBase.replace(ext, '')}${ext}`);
        },
      }),
      limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
      fileFilter: (_req, file, cb) => {
        const ok = ['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype);
        if (!ok) {
          return cb(null, false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('envie o campo file (jpeg/png/webp)');
    }
    await this.productsService.updateImageFilename(id, file.filename);
    return {
      productId: id,
      imageUrl: `/products/${id}/image`,
    };
  }

  @Get(':id/image')
  @ApiOperation({ summary: 'Obter/Visualizar imagem do produto' })
  @ApiResponse({ status: 200, description: 'Stream da imagem retornada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Produto sem imagem ou arquivo ausente no disco.' })
  async getImage(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<StreamableFile> {
    const product = await this.productsService.findOne(id);
    if (!product.imageFilenames) {
      throw new NotFoundException('produto sem imagem');
    }
    const filename = basename(product.imageFilenames);
    const filePath = join(process.cwd(), 'uploads', filename);
    if (!existsSync(filePath)) {
      throw new NotFoundException('arquivo ausente no disco');
    }
    let type = 'image/jpeg';
    if (filename.endsWith('.png')) type = 'image/png';
    else if (filename.endsWith('.webp')) type = 'image/webp';
    return new StreamableFile(createReadStream(filePath), { type });
  }
}