declare module 'express-static-gzip' {
    interface OptionsT {
        enableBrotli?: boolean
        index?: boolean
        customCompressions?: [{ encodingName: string; fileExtension: string }]
        orderPreference?: string[]
    }
    const gzip: (path: any, options?: OptionsT) => any
    export default gzip
}