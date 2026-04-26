 import { Module } from '@nestjs/common'
 import { FirebaseService } from './firebas.service'

 @Module({
     providers: [FirebaseService],
     exports: [FirebaseService],
 })
 export class FirebaseModule {}
