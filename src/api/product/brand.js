import http from '../../utils/httpRequest';

export const uploadUrl = http.adornUrl('/mall-third/oss/uploadFile');

// 获取分类树
export function getCategoryTree () {
  return http({
    url: http.adornUrl('/mall-product/category/listWithTree'),
    method: 'get',
    params: {}
  });
}

// 获取品牌信息
export function getBrandInfo (brandId) {
  return http({
    url: http.adornUrl('/mall-product/brand/info' + '/' + brandId),
    method: 'get',
    params: {}
  });
}

// 获取分类树子节点
export function getCategoryChild (parentCid) {
  return http({
    url: http.adornUrl('/mall-product/category/listChildNodes'),
    method: 'get',
    params: {parentCid: parentCid}
  });
}

// 保存单个分类信息
export function saveCategory (data) {
  return http({
    url: http.adornUrl('/mall-product/category/save'),
    method: 'post',
    data: http.adornData(data)
  });
}

// 保存单个分类信息
export function deleteCategory (data) {
  return http({
    url: http.adornUrl('/mall-product/category/delete'),
    method: 'post',
    data: http.adornData(data, false)
  });
}

// 获取单个分类信息
export function getCategoryById (catId) {
  return http({
    url: http.adornUrl('/mall-product/category/info/' + catId),
    method: 'get',
    params: {}
  });
}

// 更新单个分类信息
export function updateCategoryById (data) {
  return http({
    url: http.adornUrl('/mall-product/category/update'),
    method: 'post',
    data: http.adornData(data)
  });
}
