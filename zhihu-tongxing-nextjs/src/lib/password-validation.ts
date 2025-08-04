// 密码强度验证工具模块

export interface PasswordRequirement {
  test: boolean
  message: string
  level: 'basic' | 'medium' | 'strong'
}

export interface PasswordValidationResult {
  requirements: PasswordRequirement[]
  strength: number
  level: 'weak' | 'medium' | 'strong' | 'very-strong'
  isValid: boolean
  score: number
}

// 密码强度要求配置
const PASSWORD_REQUIREMENTS: Omit<PasswordRequirement, 'test'>[] = [
  { message: '至少12个字符', level: 'basic' },
  { message: '包含小写字母', level: 'basic' },
  { message: '包含大写字母', level: 'basic' },
  { message: '包含数字', level: 'basic' },
  { message: '包含特殊符号', level: 'medium' },
  { message: '不包含连续重复字符', level: 'strong' },
  { message: '不包含常见弱密码模式', level: 'strong' },
]

// 常见弱密码模式
const WEAK_PATTERNS = [
  /123456/,
  /password/i,
  /admin/i,
  /qwerty/i,
  /abc123/i,
  /111111/,
  /000000/,
  /123123/,
  /987654321/,
  /qwertyuiop/i,
  /asdfghjkl/i,
  /zxcvbnm/i,
]

// 常见键盘序列
const KEYBOARD_SEQUENCES = [
  'qwertyuiop',
  'asdfghjkl',
  'zxcvbnm',
  '1234567890',
  'abcdefghijklmnopqrstuvwxyz',
]

/**
 * 检查密码是否包含键盘序列
 */
function containsKeyboardSequence(password: string): boolean {
  const lowerPassword = password.toLowerCase()
  
  for (const sequence of KEYBOARD_SEQUENCES) {
    // 检查正向序列（长度>=4）
    for (let i = 0; i <= sequence.length - 4; i++) {
      const subSeq = sequence.substring(i, i + 4)
      if (lowerPassword.includes(subSeq)) {
        return true
      }
    }
    
    // 检查反向序列（长度>=4）
    const reversed = sequence.split('').reverse().join('')
    for (let i = 0; i <= reversed.length - 4; i++) {
      const subSeq = reversed.substring(i, i + 4)
      if (lowerPassword.includes(subSeq)) {
        return true
      }
    }
  }
  
  return false
}

/**
 * 检查密码是否包含重复字符模式
 */
function containsRepeatingPattern(password: string): boolean {
  // 检查连续重复字符（3个或以上）
  if (/(.)\1{2,}/.test(password)) {
    return true
  }
  
  // 检查重复模式（如abcabc, 123123）
  for (let len = 2; len <= Math.floor(password.length / 2); len++) {
    for (let i = 0; i <= password.length - len * 2; i++) {
      const pattern = password.substring(i, i + len)
      const next = password.substring(i + len, i + len * 2)
      if (pattern === next) {
        return true
      }
    }
  }
  
  return false
}

/**
 * 计算密码熵值（信息熵）
 */
function calculateEntropy(password: string): number {
  const charSets = [
    /[a-z]/, // 小写字母
    /[A-Z]/, // 大写字母
    /[0-9]/, // 数字
    /[!@#$%^&*(),.?":{}|<>]/, // 特殊符号
    /[^\w\s!@#$%^&*(),.?":{}|<>]/, // 其他字符
  ]
  
  let charSetSize = 0
  for (const charSet of charSets) {
    if (charSet.test(password)) {
      charSetSize += charSet === /[a-z]/ ? 26 :
                     charSet === /[A-Z]/ ? 26 :
                     charSet === /[0-9]/ ? 10 :
                     charSet === /[!@#$%^&*(),.?":{}|<>]/ ? 32 : 10
    }
  }
  
  if (charSetSize === 0) charSetSize = 1
  
  // 熵 = log2(字符集大小^密码长度)
  return Math.log2(Math.pow(charSetSize, password.length))
}

/**
 * 验证密码强度
 */
export function validatePasswordStrength(password: string): PasswordValidationResult {
  const requirements: PasswordRequirement[] = [
    {
      test: password.length >= 12,
      message: '至少12个字符',
      level: 'basic'
    },
    {
      test: /[a-z]/.test(password),
      message: '包含小写字母',
      level: 'basic'
    },
    {
      test: /[A-Z]/.test(password),
      message: '包含大写字母',
      level: 'basic'
    },
    {
      test: /\d/.test(password),
      message: '包含数字',
      level: 'basic'
    },
    {
      test: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      message: '包含特殊符号',
      level: 'medium'
    },
    {
      test: !containsRepeatingPattern(password),
      message: '不包含重复模式',
      level: 'strong'
    },
    {
      test: !WEAK_PATTERNS.some(pattern => pattern.test(password)),
      message: '不包含常见弱密码',
      level: 'strong'
    },
    {
      test: !containsKeyboardSequence(password),
      message: '不包含键盘序列',
      level: 'strong'
    }
  ]

  // 计算基础分数
  const passedBasic = requirements.filter(req => req.level === 'basic' && req.test).length
  const passedMedium = requirements.filter(req => req.level === 'medium' && req.test).length
  const passedStrong = requirements.filter(req => req.level === 'strong' && req.test).length
  
  const totalBasic = requirements.filter(req => req.level === 'basic').length
  const totalMedium = requirements.filter(req => req.level === 'medium').length
  const totalStrong = requirements.filter(req => req.level === 'strong').length

  // 加权计算强度
  const basicScore = (passedBasic / totalBasic) * 0.4
  const mediumScore = (passedMedium / totalMedium) * 0.3
  const strongScore = (passedStrong / totalStrong) * 0.3

  const strength = basicScore + mediumScore + strongScore

  // 计算熵值加成
  const entropy = calculateEntropy(password)
  const entropyBonus = Math.min(entropy / 100, 0.2) // 最多20%加成

  const finalStrength = Math.min(strength + entropyBonus, 1)

  // 计算分数（0-100）
  const score = Math.round(finalStrength * 100)

  // 确定强度等级
  let level: 'weak' | 'medium' | 'strong' | 'very-strong'
  if (finalStrength < 0.3) {
    level = 'weak'
  } else if (finalStrength < 0.6) {
    level = 'medium'
  } else if (finalStrength < 0.8) {
    level = 'strong'
  } else {
    level = 'very-strong'
  }

  // 密码有效性：所有基础要求必须满足
  const isValid = passedBasic === totalBasic && passedMedium === totalMedium

  return {
    requirements,
    strength: finalStrength,
    level,
    isValid,
    score
  }
}

/**
 * 获取密码强度颜色
 */
export function getPasswordStrengthColor(level: string): string {
  switch (level) {
    case 'weak': return 'bg-red-500'
    case 'medium': return 'bg-yellow-500'
    case 'strong': return 'bg-blue-500'
    case 'very-strong': return 'bg-green-500'
    default: return 'bg-gray-300'
  }
}

/**
 * 获取密码强度文本
 */
export function getPasswordStrengthText(level: string): string {
  switch (level) {
    case 'weak': return '弱'
    case 'medium': return '中等'
    case 'strong': return '强'
    case 'very-strong': return '非常强'
    default: return '未知'
  }
}

/**
 * 生成安全密码建议
 */
export function generatePasswordSuggestions(): string[] {
  return [
    '使用至少12个字符的长密码',
    '混合使用大小写字母、数字和特殊符号',
    '避免使用个人信息（姓名、生日等）',
    '不要使用常见密码（如password、123456）',
    '避免使用键盘序列（如qwerty、123456）',
    '不要重复使用其他网站的密码',
    '考虑使用密码管理器生成和存储密码',
    '定期更换密码以保持安全性'
  ]
}

/**
 * 检查密码是否在常见泄露密码列表中
 * 注意：这里只是示例，实际应用中应该使用真实的泄露密码数据库
 */
export function isPasswordCompromised(password: string): boolean {
  const commonPasswords = [
    '123456', 'password', '123456789', '12345678', '12345',
    '111111', '1234567', 'sunshine', 'qwerty', 'iloveyou',
    'admin', 'welcome', '123123', 'abc123', 'password123',
    'admin123', '1234567890', 'letmein', 'monkey', 'dragon'
  ]
  
  return commonPasswords.includes(password.toLowerCase())
}
