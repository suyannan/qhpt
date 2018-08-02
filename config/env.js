let domain ;
let base ;
let appId ;

if (process.env.NODE_ENV == 'production') {
  domain = 'http://91top.club';
  base = domain + '/hpt/' + 'index.php';
  appId = 'wxdd662c0cfcdd3efb';
} else if (process.env.NODE_ENV == 'development') {
  domain = 'https://wqbang.cn';
  base = domain + '/qPHA/' + 'index.php';
  appId = 'wxa7641616abe7bf5f';
}
export {
  domain,
  base,
  appId
}

