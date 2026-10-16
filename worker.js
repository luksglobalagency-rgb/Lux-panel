addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url);
  
  // İstifadəçi adı və şifrəni buradan dəyişə bilərsiniz
  const USERNAME = "admin";
  const PASSWORD = "luxpanel_password123";

  const authHeader = request.headers.get('Authorization');

  if (!authHeader) {
    return new Response('Giriş tələb olunur / Authentication Required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Lux Panel Login"',
      },
    });
  }

  try {
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = atob(base64Credentials).split(':');
    const username = credentials[0];
    const password = credentials[1];

    if (username === USERNAME && password === PASSWORD) {
      // Giriş uğurludursa, istədiyiniz səhifəyə və ya məzmuna yönləndirə bilərsiniz
      return new Response('Xoş gəlmisiniz! Lux Panel-ə uğurla daxil oldunuz.', {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      });
    }
  } catch (e) {
    // Səhv olduqda
  }

  return new Response('Yanlış istifadəçi adı və ya şifrə!', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Lux Panel Login"',
      'Content-Type': 'text/plain; charset=utf-8'
    },
  });
}
