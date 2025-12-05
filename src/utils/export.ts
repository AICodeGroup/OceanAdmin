import axios from 'axios';
import { getToken } from '@/utils/auth';

/**
 * 通用文件下载函数
 * @param url - 下载地址
 * @param params - 查询参数
 * @param defaultFileName - 默认文件名
 */
export async function downloadFile(
  url: string,
  params: Record<string, any> = {},
  defaultFileName: string = 'download.xlsx'
): Promise<{ success: boolean; fileName: string }> {
  console.log('>>> downloadFile 被调用');
  console.log('URL:', url);
  console.log('参数:', params);
  
  try {
    const token = getToken();
    console.log('Token:', token ? '已获取' : '未获取');
    console.log('Token 值:', token);
    
    console.log('发送请求...');
    const response = await axios.get(url, {
      baseURL: '/',
      params,
      responseType: 'blob',
      timeout: 120000,
      headers: {
        'Authorization': token || '',
        'Accept': 'application/octet-stream, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, */*'
      }
    });
    
    console.log('请求成功，响应状态:', response.status);
    console.log('响应头:', response.headers);
    console.log('Blob 大小:', response.data.size, 'bytes');
    console.log('Blob 类型:', response.data.type);

    // 获取 Content-Type，用于创建正确的 Blob
    const contentType = response.headers['content-type'] || 'application/octet-stream';
    console.log('Content-Type:', contentType);

    // 从响应头获取文件名 - 支持标准的 filename 和 filename*=UTF-8'' 格式
    const contentDisposition = response.headers['content-disposition'];
    let fileName = defaultFileName;
    
    console.log('Content-Disposition:', contentDisposition);
    
    if (contentDisposition) {
      // 优先解析 filename*=UTF-8'' 格式（RFC 5987）
      const filenameStarMatch = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
      if (filenameStarMatch && filenameStarMatch[1]) {
        fileName = decodeURIComponent(filenameStarMatch[1]);
        console.log('从 filename*=UTF-8 解析文件名:', fileName);
      } else {
        // 回退到普通的 filename 格式
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch && filenameMatch[1]) {
          fileName = decodeURIComponent(filenameMatch[1].replace(/['"]/g, ''));
          console.log('从 filename 解析文件名:', fileName);
        }
      }
    }
    
    console.log('最终文件名:', fileName);

    // 创建 Blob 时指定正确的 MIME 类型
    const blob = new Blob([response.data], { type: contentType });
    console.log('创建的 Blob:', blob.size, 'bytes, type:', blob.type);
    
    const downloadUrl = window.URL.createObjectURL(blob);
    console.log('创建下载 URL:', downloadUrl);
    
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = fileName;
    document.body.appendChild(link);
    
    console.log('触发下载...');
    link.click();
    
    // 延迟清理，确保下载开始
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      console.log('下载链接已清理');
    }, 100);

    return { success: true, fileName };
  } catch (error) {
    console.error('文件下载失败:', error);
    if (axios.isAxiosError(error)) {
      console.error('错误详情:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        headers: error.response?.headers,
        data: error.response?.data
      });
    }
    throw error;
  }
}

/**
 * 导出用户数据
 */
export async function exportUsers(params: Record<string, any> = {}) {
  console.log('>>> exportUsers 被调用，参数:', params);
  const result = await downloadFile(
    '/admin/platform/export/user/excel',
    params,
    `用户数据_${new Date().getTime()}.xlsx`
  );
  console.log('>>> exportUsers 完成:', result);
  return result;
}

/**
 * 导出订单数据
 */
export async function exportOrders(params: Record<string, any> = {}) {
  return downloadFile(
    '/admin/platform/export/order/excel',
    params,
    `订单数据_${new Date().getTime()}.xlsx`
  );
}
