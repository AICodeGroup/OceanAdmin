/**
 * 商品详情模板库
 * 提供各种常用的商品详情模板，方便快速填充
 */

export interface ProductTemplate {
  id: string
  name: string
  category: string
  preview: string
  content: string
}

export const productTemplates: ProductTemplate[] = [
  {
    id: 'basic',
    name: '基础商品详情',
    category: '通用',
    preview: '包含商品主图、参数表和详情图的基础模板',
    content: `
<div style="width: 750px; margin: 0 auto; font-family: Arial, sans-serif;">
  <!-- 商品主图区域 -->
  <div style="text-align: center; margin-bottom: 20px;">
    <img src="https://via.placeholder.com/750x750?text=商品主图" style="width: 750px; max-width: 100%; height: auto;" />
  </div>

  <!-- 商品参数表 -->
  <div style="margin: 20px 0;">
    <h2 style="font-size: 24px; color: #333; margin-bottom: 15px; padding-left: 10px; border-left: 4px solid #409eff;">商品参数</h2>
    <table style="width: 100%; border-collapse: collapse; margin: 10px 0;">
      <tbody>
        <tr style="background-color: #f5f7fa;">
          <td style="padding: 12px; border: 1px solid #e4e7ed; font-weight: bold; width: 30%;">商品名称</td>
          <td style="padding: 12px; border: 1px solid #e4e7ed;">请填写商品名称</td>
        </tr>
        <tr>
          <td style="padding: 12px; border: 1px solid #e4e7ed; font-weight: bold;">商品规格</td>
          <td style="padding: 12px; border: 1px solid #e4e7ed;">请填写商品规格</td>
        </tr>
        <tr style="background-color: #f5f7fa;">
          <td style="padding: 12px; border: 1px solid #e4e7ed; font-weight: bold;">商品产地</td>
          <td style="padding: 12px; border: 1px solid #e4e7ed;">请填写商品产地</td>
        </tr>
        <tr>
          <td style="padding: 12px; border: 1px solid #e4e7ed; font-weight: bold;">保质期</td>
          <td style="padding: 12px; border: 1px solid #e4e7ed;">请填写保质期</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- 商品详情图区域 -->
  <div style="margin: 20px 0;">
    <h2 style="font-size: 24px; color: #333; margin-bottom: 15px; padding-left: 10px; border-left: 4px solid #409eff;">商品详情</h2>
    <div style="text-align: center;">
      <img src="https://via.placeholder.com/750x1000?text=详情图1" style="width: 750px; max-width: 100%; height: auto; margin-bottom: 10px;" />
      <img src="https://via.placeholder.com/750x1000?text=详情图2" style="width: 750px; max-width: 100%; height: auto; margin-bottom: 10px;" />
      <img src="https://via.placeholder.com/750x1000?text=详情图3" style="width: 750px; max-width: 100%; height: auto;" />
    </div>
  </div>
</div>
    `
  },
  {
    id: 'food',
    name: '食品类商品',
    category: '食品',
    preview: '适用于食品、零食等商品，包含营养成分表',
    content: `
<div style="width: 750px; margin: 0 auto; font-family: Arial, sans-serif;">
  <!-- 商品主图 -->
  <div style="text-align: center; margin-bottom: 20px;">
    <img src="https://via.placeholder.com/750x750?text=食品主图" style="width: 750px; max-width: 100%; height: auto;" />
  </div>

  <!-- 产品亮点 -->
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; margin: 20px 0; border-radius: 10px; color: white;">
    <h2 style="font-size: 28px; margin-bottom: 20px; text-align: center;">产品亮点</h2>
    <ul style="list-style: none; padding: 0; margin: 0;">
      <li style="padding: 10px 0; font-size: 18px;">✓ 精选优质原料，品质保证</li>
      <li style="padding: 10px 0; font-size: 18px;">✓ 无添加防腐剂，健康安全</li>
      <li style="padding: 10px 0; font-size: 18px;">✓ 独立包装，方便携带</li>
      <li style="padding: 10px 0; font-size: 18px;">✓ 口感丰富，老少皆宜</li>
    </ul>
  </div>

  <!-- 营养成分表 -->
  <div style="margin: 30px 0;">
    <h2 style="font-size: 24px; color: #333; margin-bottom: 15px; padding-left: 10px; border-left: 4px solid #ff6b6b;">营养成分表</h2>
    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr style="background-color: #ff6b6b; color: white;">
          <th style="padding: 12px; border: 1px solid #e4e7ed; text-align: left;">项目</th>
          <th style="padding: 12px; border: 1px solid #e4e7ed; text-align: center;">每100克含量</th>
          <th style="padding: 12px; border: 1px solid #e4e7ed; text-align: center;">NRV%</th>
        </tr>
      </thead>
      <tbody>
        <tr style="background-color: #fff5f5;">
          <td style="padding: 12px; border: 1px solid #e4e7ed;">能量</td>
          <td style="padding: 12px; border: 1px solid #e4e7ed; text-align: center;">XXX千焦</td>
          <td style="padding: 12px; border: 1px solid #e4e7ed; text-align: center;">XX%</td>
        </tr>
        <tr>
          <td style="padding: 12px; border: 1px solid #e4e7ed;">蛋白质</td>
          <td style="padding: 12px; border: 1px solid #e4e7ed; text-align: center;">XXg</td>
          <td style="padding: 12px; border: 1px solid #e4e7ed; text-align: center;">XX%</td>
        </tr>
        <tr style="background-color: #fff5f5;">
          <td style="padding: 12px; border: 1px solid #e4e7ed;">脂肪</td>
          <td style="padding: 12px; border: 1px solid #e4e7ed; text-align: center;">XXg</td>
          <td style="padding: 12px; border: 1px solid #e4e7ed; text-align: center;">XX%</td>
        </tr>
        <tr>
          <td style="padding: 12px; border: 1px solid #e4e7ed;">碳水化合物</td>
          <td style="padding: 12px; border: 1px solid #e4e7ed; text-align: center;">XXg</td>
          <td style="padding: 12px; border: 1px solid #e4e7ed; text-align: center;">XX%</td>
        </tr>
        <tr style="background-color: #fff5f5;">
          <td style="padding: 12px; border: 1px solid #e4e7ed;">钠</td>
          <td style="padding: 12px; border: 1px solid #e4e7ed; text-align: center;">XXmg</td>
          <td style="padding: 12px; border: 1px solid #e4e7ed; text-align: center;">XX%</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- 商品详情 -->
  <div style="margin: 30px 0;">
    <h2 style="font-size: 24px; color: #333; margin-bottom: 15px; padding-left: 10px; border-left: 4px solid #ff6b6b;">商品详情</h2>
    <div style="text-align: center;">
      <img src="https://via.placeholder.com/750x1000?text=详情图1" style="width: 750px; max-width: 100%; height: auto; margin-bottom: 10px;" />
      <img src="https://via.placeholder.com/750x1000?text=详情图2" style="width: 750px; max-width: 100%; height: auto; margin-bottom: 10px;" />
    </div>
  </div>

  <!-- 温馨提示 -->
  <div style="background-color: #fff8e1; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #ffc107;">
    <h3 style="color: #f57c00; margin-top: 0;">温馨提示</h3>
    <p style="color: #666; line-height: 1.8;">1. 请置于阴凉干燥处保存，避免阳光直射</p>
    <p style="color: #666; line-height: 1.8;">2. 开封后请尽快食用完毕</p>
    <p style="color: #666; line-height: 1.8;">3. 如有过敏体质，请仔细查看配料表</p>
  </div>
</div>
    `
  },
  {
    id: 'electronics',
    name: '电子产品',
    category: '数码',
    preview: '适用于电子产品，包含产品规格和功能特点',
    content: `
<div style="width: 750px; margin: 0 auto; font-family: Arial, sans-serif; background-color: #f8f9fa;">
  <!-- 产品主图 -->
  <div style="text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 0;">
    <img src="https://via.placeholder.com/750x750?text=电子产品主图" style="width: 700px; max-width: 93%; height: auto; border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);" />
  </div>

  <!-- 核心卖点 -->
  <div style="background-color: white; padding: 30px; margin: 20px;">
    <h2 style="font-size: 28px; color: #333; text-align: center; margin-bottom: 30px;">核心卖点</h2>
    <div style="display: flex; justify-content: space-around; flex-wrap: wrap;">
      <div style="text-align: center; margin: 15px; flex: 1; min-width: 150px;">
        <div style="font-size: 48px; color: #667eea; margin-bottom: 10px;">⚡</div>
        <div style="font-size: 18px; color: #333; font-weight: bold;">高性能</div>
        <div style="font-size: 14px; color: #666; margin-top: 5px;">强劲动力</div>
      </div>
      <div style="text-align: center; margin: 15px; flex: 1; min-width: 150px;">
        <div style="font-size: 48px; color: #667eea; margin-bottom: 10px;">🔋</div>
        <div style="font-size: 18px; color: #333; font-weight: bold;">长续航</div>
        <div style="font-size: 14px; color: #666; margin-top: 5px;">持久耐用</div>
      </div>
      <div style="text-align: center; margin: 15px; flex: 1; min-width: 150px;">
        <div style="font-size: 48px; color: #667eea; margin-bottom: 10px;">📱</div>
        <div style="font-size: 18px; color: #333; font-weight: bold;">智能互联</div>
        <div style="font-size: 14px; color: #666; margin-top: 5px;">便捷操作</div>
      </div>
    </div>
  </div>

  <!-- 产品规格 -->
  <div style="background-color: white; padding: 30px; margin: 20px;">
    <h2 style="font-size: 24px; color: #333; margin-bottom: 20px; padding-left: 10px; border-left: 4px solid #667eea;">产品规格</h2>
    <table style="width: 100%; border-collapse: collapse;">
      <tbody>
        <tr style="background-color: #f8f9fa;">
          <td style="padding: 15px; border-bottom: 1px solid #e4e7ed; font-weight: bold; width: 35%;">型号</td>
          <td style="padding: 15px; border-bottom: 1px solid #e4e7ed;">XXX-XXX</td>
        </tr>
        <tr>
          <td style="padding: 15px; border-bottom: 1px solid #e4e7ed; font-weight: bold;">尺寸</td>
          <td style="padding: 15px; border-bottom: 1px solid #e4e7ed;">XXX × XXX × XXX mm</td>
        </tr>
        <tr style="background-color: #f8f9fa;">
          <td style="padding: 15px; border-bottom: 1px solid #e4e7ed; font-weight: bold;">重量</td>
          <td style="padding: 15px; border-bottom: 1px solid #e4e7ed;">约XXXg</td>
        </tr>
        <tr>
          <td style="padding: 15px; border-bottom: 1px solid #e4e7ed; font-weight: bold;">电池容量</td>
          <td style="padding: 15px; border-bottom: 1px solid #e4e7ed;">XXXXmAh</td>
        </tr>
        <tr style="background-color: #f8f9fa;">
          <td style="padding: 15px; border-bottom: 1px solid #e4e7ed; font-weight: bold;">充电时间</td>
          <td style="padding: 15px; border-bottom: 1px solid #e4e7ed;">约XX小时</td>
        </tr>
        <tr>
          <td style="padding: 15px; border-bottom: 1px solid #e4e7ed; font-weight: bold;">工作温度</td>
          <td style="padding: 15px; border-bottom: 1px solid #e4e7ed;">0℃ ~ 40℃</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- 产品详情图 -->
  <div style="text-align: center; margin: 20px 0;">
    <img src="https://via.placeholder.com/750x1000?text=产品细节1" style="width: 750px; max-width: 100%; height: auto;" />
    <img src="https://via.placeholder.com/750x1000?text=产品细节2" style="width: 750px; max-width: 100%; height: auto;" />
  </div>

  <!-- 售后服务 -->
  <div style="background-color: white; padding: 30px; margin: 20px;">
    <h2 style="font-size: 24px; color: #333; margin-bottom: 20px; text-align: center;">售后服务</h2>
    <div style="color: #666; line-height: 2;">
      <p>✓ 7天无理由退换</p>
      <p>✓ 1年质保服务</p>
      <p>✓ 全国联保，就近维修</p>
      <p>✓ 24小时在线客服</p>
    </div>
  </div>
</div>
    `
  },
  {
    id: 'clothing',
    name: '服装类商品',
    category: '服饰',
    preview: '适用于服装鞋帽，包含尺码表和面料说明',
    content: `
<div style="width: 750px; margin: 0 auto; font-family: Arial, sans-serif;">
  <!-- 商品主图 -->
  <div style="text-align: center; margin-bottom: 20px;">
    <img src="https://via.placeholder.com/750x1000?text=服装主图" style="width: 750px; max-width: 100%; height: auto;" />
  </div>

  <!-- 产品特点 -->
  <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; margin: 20px 0; color: white;">
    <h2 style="font-size: 28px; margin-bottom: 20px; text-align: center;">产品特点</h2>
    <div style="font-size: 16px; line-height: 2;">
      <p>· 精选优质面料，柔软舒适</p>
      <p>· 精致做工，走线细密</p>
      <p>· 版型修身，凸显身材</p>
      <p>· 百搭款式，适合多种场合</p>
    </div>
  </div>

  <!-- 尺码表 -->
  <div style="margin: 30px 0;">
    <h2 style="font-size: 24px; color: #333; margin-bottom: 15px; padding-left: 10px; border-left: 4px solid #f5576c;">尺码对照表</h2>
    <table style="width: 100%; border-collapse: collapse; text-align: center;">
      <thead>
        <tr style="background-color: #f5576c; color: white;">
          <th style="padding: 12px; border: 1px solid #e4e7ed;">尺码</th>
          <th style="padding: 12px; border: 1px solid #e4e7ed;">衣长(cm)</th>
          <th style="padding: 12px; border: 1px solid #e4e7ed;">胸围(cm)</th>
          <th style="padding: 12px; border: 1px solid #e4e7ed;">肩宽(cm)</th>
          <th style="padding: 12px; border: 1px solid #e4e7ed;">袖长(cm)</th>
        </tr>
      </thead>
      <tbody>
        <tr style="background-color: #fff5f7;">
          <td style="padding: 12px; border: 1px solid #e4e7ed; font-weight: bold;">S</td>
          <td style="padding: 12px; border: 1px solid #e4e7ed;">XX</td>
          <td style="padding: 12px; border: 1px solid #e4e7ed;">XX</td>
          <td style="padding: 12px; border: 1px solid #e4e7ed;">XX</td>
          <td style="padding: 12px; border: 1px solid #e4e7ed;">XX</td>
        </tr>
        <tr>
          <td style="padding: 12px; border: 1px solid #e4e7ed; font-weight: bold;">M</td>
          <td style="padding: 12px; border: 1px solid #e4e7ed;">XX</td>
          <td style="padding: 12px; border: 1px solid #e4e7ed;">XX</td>
          <td style="padding: 12px; border: 1px solid #e4e7ed;">XX</td>
          <td style="padding: 12px; border: 1px solid #e4e7ed;">XX</td>
        </tr>
        <tr style="background-color: #fff5f7;">
          <td style="padding: 12px; border: 1px solid #e4e7ed; font-weight: bold;">L</td>
          <td style="padding: 12px; border: 1px solid #e4e7ed;">XX</td>
          <td style="padding: 12px; border: 1px solid #e4e7ed;">XX</td>
          <td style="padding: 12px; border: 1px solid #e4e7ed;">XX</td>
          <td style="padding: 12px; border: 1px solid #e4e7ed;">XX</td>
        </tr>
        <tr>
          <td style="padding: 12px; border: 1px solid #e4e7ed; font-weight: bold;">XL</td>
          <td style="padding: 12px; border: 1px solid #e4e7ed;">XX</td>
          <td style="padding: 12px; border: 1px solid #e4e7ed;">XX</td>
          <td style="padding: 12px; border: 1px solid #e4e7ed;">XX</td>
          <td style="padding: 12px; border: 1px solid #e4e7ed;">XX</td>
        </tr>
      </tbody>
    </table>
    <p style="color: #999; font-size: 14px; margin-top: 10px; text-align: center;">* 以上数据为平铺测量，因测量方式不同会有1-3cm误差，属正常现象</p>
  </div>

  <!-- 面料说明 -->
  <div style="margin: 30px 0;">
    <h2 style="font-size: 24px; color: #333; margin-bottom: 15px; padding-left: 10px; border-left: 4px solid #f5576c;">面料说明</h2>
    <table style="width: 100%; border-collapse: collapse;">
      <tbody>
        <tr style="background-color: #f5f7fa;">
          <td style="padding: 15px; border: 1px solid #e4e7ed; font-weight: bold; width: 30%;">面料成分</td>
          <td style="padding: 15px; border: 1px solid #e4e7ed;">请填写面料成分</td>
        </tr>
        <tr>
          <td style="padding: 15px; border: 1px solid #e4e7ed; font-weight: bold;">面料特点</td>
          <td style="padding: 15px; border: 1px solid #e4e7ed;">柔软舒适，透气吸汗</td>
        </tr>
        <tr style="background-color: #f5f7fa;">
          <td style="padding: 15px; border: 1px solid #e4e7ed; font-weight: bold;">洗涤方式</td>
          <td style="padding: 15px; border: 1px solid #e4e7ed;">机洗/手洗，水温不超过30℃</td>
        </tr>
        <tr>
          <td style="padding: 15px; border: 1px solid #e4e7ed; font-weight: bold;">晾晒方式</td>
          <td style="padding: 15px; border: 1px solid #e4e7ed;">阴凉处自然晾干，避免暴晒</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- 商品详情图 -->
  <div style="text-align: center; margin: 20px 0;">
    <img src="https://via.placeholder.com/750x1000?text=细节图1" style="width: 750px; max-width: 100%; height: auto; margin-bottom: 10px;" />
    <img src="https://via.placeholder.com/750x1000?text=细节图2" style="width: 750px; max-width: 100%; height: auto;" />
  </div>
</div>
    `
  }
]

/**
 * 根据分类获取模板
 */
export function getTemplatesByCategory(category?: string): ProductTemplate[] {
  if (!category) {
    return productTemplates
  }
  return productTemplates.filter(t => t.category === category)
}

/**
 * 根据ID获取模板
 */
export function getTemplateById(id: string): ProductTemplate | undefined {
  return productTemplates.find(t => t.id === id)
}

/**
 * 获取所有分类
 */
export function getCategories(): string[] {
  const categories = new Set<string>()
  productTemplates.forEach(t => categories.add(t.category))
  return Array.from(categories)
}
