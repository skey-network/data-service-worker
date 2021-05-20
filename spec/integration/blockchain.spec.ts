// import '../setup'

// import { Blockchain } from '../../src/Blockchain'
// import { ReflectiveInjector } from 'injection-js'
// import { GrpcClient } from '../../src/GrpcClient'
// import { Common } from '../../src/Common'

// describe('Blockchain', () => {
//   let service: Blockchain

//   beforeEach(() => {
//     const injector = ReflectiveInjector.resolveAndCreate([Blockchain, GrpcClient, Common])

//     service = injector.get(Blockchain)
//   })

//   describe('fetchHeight', () => {
//     it('returns correct height', async () => {
//       const height = await service.fetchHeight()

//       expect(height).toBeGreaterThan(0)
//     })
//   })
// })
