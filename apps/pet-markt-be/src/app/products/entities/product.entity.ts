import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class Product {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  id!: number;

  @Field(() => String, { description: 'Nombre del producto' })
  name!: string;

  @Field(() => String, { description: 'Descripción del producto' })
  description!: string;

  @Field(() => Float, { description: 'Precio del producto en centavos' })
  price!: number;

  @Field(() => String, { description: 'URL de la imagen del producto' })
  image!: string;

  @Field(() => String, { description: 'ID del precio en Stripe' })
  stripePriceId!: string;

  @Field(() => Boolean, { description: 'Indica si el producto está activo' })
  isFeatures!: boolean;

  @Field(() => Date, { description: 'Indica si el producto está destacado' })
  createdAt!: Date;

  @Field(() => Date, { description: 'Fecha de creación del producto' })
  updatedAt!: Date;
}
