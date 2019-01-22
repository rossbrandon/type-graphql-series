import {
  Resolver,
  Mutation,
  Arg,
  Field,
  ClassType,
  InputType,
  UseMiddleware
} from 'type-graphql'
import { User } from '../../entity/User'
import { Product } from '../../entity/Product'
import { RegisterInput } from './register/RegisterInput'
import { Middleware } from 'type-graphql/interfaces/Middleware'

function createResolver<T extends ClassType, X extends ClassType>(
  suffix: string,
  returnType: T,
  inputType: X,
  entity: any,
  middlware?: Middleware<any>[]
) {
  @Resolver()
  class BaseResolver {
    protected items: T[] = []

    @Mutation(() => returnType, { name: `create${suffix}` })
    @UseMiddleware(...(middlware || []))
    async create(@Arg('data', () => inputType) data: any) {
      return entity.create(data).save()
    }
  }

  return BaseResolver
}

@InputType()
class ProductInput {
  @Field()
  name: string
}

export const CreateUserResolver = createResolver(
  'User',
  User,
  RegisterInput,
  User
)
export const CreateProductResolver = createResolver(
  'Product',
  Product,
  ProductInput,
  Product
)
