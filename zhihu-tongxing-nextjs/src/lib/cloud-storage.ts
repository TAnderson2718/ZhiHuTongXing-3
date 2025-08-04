/**
 * 云存储服务集成
 * 支持阿里云OSS、腾讯云COS等主流云存储服务
 */

export interface CloudStorageConfig {
  provider: 'aliyun-oss' | 'tencent-cos' | 'aws-s3' | 'local'
  region?: string
  bucket?: string
  accessKeyId?: string
  accessKeySecret?: string
  endpoint?: string
  cdnDomain?: string
}

export interface UploadResult {
  success: boolean
  url: string
  key: string
  size: number
  error?: string
  etag?: string
  cdnUrl?: string
  provider: string
  uploadedAt: Date
}

export interface FileInfo {
  key: string
  size: number
  lastModified: Date
  etag?: string
  contentType?: string
  url: string
  cdnUrl?: string
}

export interface UploadOptions {
  filename?: string
  folder?: string
  contentType?: string
  isPublic?: boolean
  metadata?: Record<string, string>
  cacheControl?: string
  expires?: Date
}

// 云存储服务抽象类
export abstract class CloudStorageService {
  protected config: CloudStorageConfig

  constructor(config: CloudStorageConfig) {
    this.config = config
  }

  abstract upload(file: Buffer, options: UploadOptions): Promise<UploadResult>
  abstract delete(key: string): Promise<boolean>
  abstract exists(key: string): Promise<boolean>
  abstract getSignedUrl(key: string, expiresIn?: number): Promise<string>
  abstract listFiles(prefix?: string, limit?: number): Promise<FileInfo[]>
  abstract getFileInfo(key: string): Promise<FileInfo | null>
  abstract copy(sourceKey: string, targetKey: string): Promise<boolean>

  // 通用方法
  getPublicUrl(key: string): string {
    if (this.config.cdnDomain) {
      return `${this.config.cdnDomain}/${key}`
    }
    return this.getSignedUrl(key, 0) // 永久URL
  }

  protected generateKey(filename: string, folder?: string): string {
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 8)
    const extension = filename.split('.').pop()
    const key = `${timestamp}_${randomStr}.${extension}`

    return folder ? `${folder}/${key}` : key
  }

  protected getContentType(filename: string): string {
    const extension = filename.split('.').pop()?.toLowerCase()
    const mimeTypes: Record<string, string> = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp',
      'mp4': 'video/mp4',
      'webm': 'video/webm',
      'ogg': 'video/ogg',
      'pdf': 'application/pdf',
      'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    }
    return mimeTypes[extension || ''] || 'application/octet-stream'
  }
}

// 阿里云OSS服务
export class AliyunOSSService extends CloudStorageService {
  async upload(file: Buffer, options: UploadOptions): Promise<UploadResult> {
    try {
      // 这里需要安装并使用 ali-oss SDK
      // npm install ali-oss
      
      const OSS = require('ali-oss')
      const client = new OSS({
        region: this.config.region,
        accessKeyId: this.config.accessKeyId,
        accessKeySecret: this.config.accessKeySecret,
        bucket: this.config.bucket,
      })

      const key = this.generateKey(options.filename || 'file', options.folder)
      const result = await client.put(key, file, {
        headers: {
          'Content-Type': options.contentType || 'application/octet-stream',
        },
      })

      const url = this.config.cdnDomain 
        ? `${this.config.cdnDomain}/${key}`
        : result.url

      return {
        success: true,
        url,
        key,
        size: file.length,
        etag: result.etag,
        cdnUrl: this.config.cdnDomain ? `${this.config.cdnDomain}/${key}` : undefined,
        provider: 'aliyun-oss',
        uploadedAt: new Date(),
      }
    } catch (error) {
      console.error('阿里云OSS上传失败:', error)
      return {
        success: false,
        url: '',
        key: '',
        size: 0,
        error: error instanceof Error ? error.message : '上传失败',
        provider: 'aliyun-oss',
        uploadedAt: new Date(),
      }
    }
  }

  async delete(key: string): Promise<boolean> {
    try {
      const OSS = require('ali-oss')
      const client = new OSS({
        region: this.config.region,
        accessKeyId: this.config.accessKeyId,
        accessKeySecret: this.config.accessKeySecret,
        bucket: this.config.bucket,
      })

      await client.delete(key)
      return true
    } catch (error) {
      console.error('阿里云OSS删除失败:', error)
      return false
    }
  }

  async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    try {
      const OSS = require('ali-oss')
      const client = new OSS({
        region: this.config.region,
        accessKeyId: this.config.accessKeyId,
        accessKeySecret: this.config.accessKeySecret,
        bucket: this.config.bucket,
      })

      return await client.signatureUrl(key, { expires: expiresIn })
    } catch (error) {
      console.error('生成签名URL失败:', error)
      return ''
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const OSS = require('ali-oss')
      const client = new OSS({
        region: this.config.region,
        accessKeyId: this.config.accessKeyId,
        accessKeySecret: this.config.accessKeySecret,
        bucket: this.config.bucket,
      })

      await client.head(key)
      return true
    } catch (error) {
      return false
    }
  }

  async listFiles(prefix?: string, limit: number = 100): Promise<FileInfo[]> {
    try {
      const OSS = require('ali-oss')
      const client = new OSS({
        region: this.config.region,
        accessKeyId: this.config.accessKeyId,
        accessKeySecret: this.config.accessKeySecret,
        bucket: this.config.bucket,
      })

      const result = await client.list({
        prefix,
        'max-keys': limit,
      })

      return result.objects?.map((obj: any) => ({
        key: obj.name,
        size: obj.size,
        lastModified: new Date(obj.lastModified),
        etag: obj.etag,
        url: this.getPublicUrl(obj.name),
        cdnUrl: this.config.cdnDomain ? `${this.config.cdnDomain}/${obj.name}` : undefined,
      })) || []
    } catch (error) {
      console.error('阿里云OSS列表文件失败:', error)
      return []
    }
  }

  async getFileInfo(key: string): Promise<FileInfo | null> {
    try {
      const OSS = require('ali-oss')
      const client = new OSS({
        region: this.config.region,
        accessKeyId: this.config.accessKeyId,
        accessKeySecret: this.config.accessKeySecret,
        bucket: this.config.bucket,
      })

      const result = await client.head(key)
      return {
        key,
        size: parseInt(result.res.headers['content-length']),
        lastModified: new Date(result.res.headers['last-modified']),
        etag: result.res.headers.etag,
        contentType: result.res.headers['content-type'],
        url: this.getPublicUrl(key),
        cdnUrl: this.config.cdnDomain ? `${this.config.cdnDomain}/${key}` : undefined,
      }
    } catch (error) {
      console.error('阿里云OSS获取文件信息失败:', error)
      return null
    }
  }

  async copy(sourceKey: string, targetKey: string): Promise<boolean> {
    try {
      const OSS = require('ali-oss')
      const client = new OSS({
        region: this.config.region,
        accessKeyId: this.config.accessKeyId,
        accessKeySecret: this.config.accessKeySecret,
        bucket: this.config.bucket,
      })

      await client.copy(targetKey, sourceKey)
      return true
    } catch (error) {
      console.error('阿里云OSS复制文件失败:', error)
      return false
    }
  }
}

// 腾讯云COS服务
export class TencentCOSService extends CloudStorageService {
  async upload(file: Buffer, options: UploadOptions): Promise<UploadResult> {
    try {
      // 这里需要安装并使用 cos-nodejs-sdk-v5
      // npm install cos-nodejs-sdk-v5
      
      const COS = require('cos-nodejs-sdk-v5')
      const cos = new COS({
        SecretId: this.config.accessKeyId,
        SecretKey: this.config.accessKeySecret,
      })

      const key = this.generateKey(options.filename || 'file', options.folder)
      
      return new Promise((resolve) => {
        cos.putObject({
          Bucket: this.config.bucket,
          Region: this.config.region,
          Key: key,
          Body: file,
          ContentType: options.contentType || 'application/octet-stream',
        }, (err: any, data: any) => {
          if (err) {
            resolve({
              success: false,
              url: '',
              key: '',
              size: 0,
              error: err.message,
            })
          } else {
            const url = this.config.cdnDomain 
              ? `${this.config.cdnDomain}/${key}`
              : `https://${data.Location}`

            resolve({
              success: true,
              url,
              key,
              size: file.length,
            })
          }
        })
      })
    } catch (error) {
      console.error('腾讯云COS上传失败:', error)
      return {
        success: false,
        url: '',
        key: '',
        size: 0,
        error: error instanceof Error ? error.message : '上传失败',
      }
    }
  }

  async delete(key: string): Promise<boolean> {
    try {
      const COS = require('cos-nodejs-sdk-v5')
      const cos = new COS({
        SecretId: this.config.accessKeyId,
        SecretKey: this.config.accessKeySecret,
      })

      return new Promise((resolve) => {
        cos.deleteObject({
          Bucket: this.config.bucket,
          Region: this.config.region,
          Key: key,
        }, (err: any) => {
          resolve(!err)
        })
      })
    } catch (error) {
      console.error('腾讯云COS删除失败:', error)
      return false
    }
  }

  async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    try {
      const COS = require('cos-nodejs-sdk-v5')
      const cos = new COS({
        SecretId: this.config.accessKeyId,
        SecretKey: this.config.accessKeySecret,
      })

      return new Promise((resolve) => {
        cos.getObjectUrl({
          Bucket: this.config.bucket,
          Region: this.config.region,
          Key: key,
          Sign: true,
          Expires: expiresIn,
        }, (err: any, data: any) => {
          resolve(err ? '' : data.Url)
        })
      })
    } catch (error) {
      console.error('生成签名URL失败:', error)
      return ''
    }
  }

  private generateKey(filename: string, folder?: string): string {
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 8)
    const extension = filename.split('.').pop()
    const key = `${timestamp}_${randomStr}.${extension}`
    
    return folder ? `${folder}/${key}` : key
  }
}

// 本地存储服务
export class LocalStorageService extends CloudStorageService {
  async upload(file: Buffer, options: UploadOptions): Promise<UploadResult> {
    try {
      const { writeFile, mkdir } = require('fs/promises')
      const { join } = require('path')

      const key = this.generateKey(options.filename || 'file', options.folder)
      const uploadDir = join(process.cwd(), 'public/uploads')
      const filePath = join(uploadDir, key)

      // 确保目录存在
      await mkdir(uploadDir, { recursive: true })
      
      // 保存文件
      await writeFile(filePath, file)

      return {
        success: true,
        url: `/uploads/${key}`,
        key,
        size: file.length,
      }
    } catch (error) {
      console.error('本地存储上传失败:', error)
      return {
        success: false,
        url: '',
        key: '',
        size: 0,
        error: error instanceof Error ? error.message : '上传失败',
      }
    }
  }

  async delete(key: string): Promise<boolean> {
    try {
      const { unlink } = require('fs/promises')
      const { join } = require('path')

      const filePath = join(process.cwd(), 'public/uploads', key)
      await unlink(filePath)
      return true
    } catch (error) {
      console.error('本地存储删除失败:', error)
      return false
    }
  }

  async getSignedUrl(key: string): Promise<string> {
    // 本地存储直接返回公开URL
    return `/uploads/${key}`
  }

  private generateKey(filename: string, folder?: string): string {
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 8)
    const extension = filename.split('.').pop()
    const key = `${timestamp}_${randomStr}.${extension}`
    
    return folder ? `${folder}/${key}` : key
  }
}

// 云存储服务工厂
export class CloudStorageFactory {
  static create(config: CloudStorageConfig): CloudStorageService {
    switch (config.provider) {
      case 'aliyun-oss':
        return new AliyunOSSService(config)
      case 'tencent-cos':
        return new TencentCOSService(config)
      case 'local':
      default:
        return new LocalStorageService(config)
    }
  }
}

// 默认配置
export const getDefaultStorageConfig = (): CloudStorageConfig => {
  return {
    provider: (process.env.STORAGE_PROVIDER as any) || 'local',
    region: process.env.STORAGE_REGION,
    bucket: process.env.STORAGE_BUCKET,
    accessKeyId: process.env.STORAGE_ACCESS_KEY_ID,
    accessKeySecret: process.env.STORAGE_ACCESS_KEY_SECRET,
    endpoint: process.env.STORAGE_ENDPOINT,
    cdnDomain: process.env.STORAGE_CDN_DOMAIN,
  }
}
