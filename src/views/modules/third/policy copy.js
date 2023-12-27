import http from '@/utils/httpRequest.js';
export function minio (fileName) {
  return new Promise((resolve, reject) => {
    http({
      url: http.adornUrl('/mall-third/oss/uploadUrl'),
      method: 'get',
      params: http.adornParams({name: fileName})
    }).then((data) => {
      resolve(data);
    });
  });
}
