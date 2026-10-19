export default {
  async fetch(request, env, ctx) {
    const USERNAME = "admin";
    const PASSWORD = "password123";
    const COOKIE_NAME = "lux_session";
    const COOKIE_VALUE = "authenticated_true";

    const cookieHeader = request.headers.get("Cookie") || "";
    const isLoggedIn = cookieHeader.includes(`${COOKIE_NAME}=${COOKIE_VALUE}`);
    const url = new URL(request.url);
      // Əgər istifadəçi çıxış etmək istəsə
    if (url.pathname === "/logout") {
      return new Response("Çıxış edildi", {
        status: 302,
        headers: {
          "Location": "/",
          "Set-Cookie": `${COOKIE_NAME}=; Path=/; Max-Age=0; HttpOnly`
        }
      });
    }
    // Əgər POST sorğusu gəlibsə (Giriş düyməsinə basılıbsa)
    if (request.method === "POST") {
      const formData = await request.formData();
      const user = formData.get("username");
      const pass = formData.get("password");
      if (user === USERNAME && pass === PASSWORD) {
        // Uğurlu giriş: Cookie təyin edirik və panelyə yönləndiririk
        return new Response("", {
          status: 302,
          headers: {
            "Location": "/",
            "Set-Cookie": `${COOKIE_NAME}=${COOKIE_VALUE}; Path=/; Max-Age=604800; HttpOnly; Secure`
          }
        });
      } else {
        return htmlLoginResponse("Yanlış istifadəçi adı və ya şifrə!");
      }
    }
     // Əgər istifadəçi artıq daxil olubsa, əsl Panel səhifəsini göstəririk
    if (isLoggedIn) {
      return htmlDashboardResponse();
    }
        // Əks halda giriş səhifəsini göstəririk
    return htmlLoginResponse("");
  }
};
// Giriş Forması (Login Səhifəsi)
function htmlLoginResponse(errorMsg) {
  const html = `<!DOCTYPE html>
<html lang="az">
<head>
<meta charset="UTF-8">
<title>Lux Panel - Giriş</title>
<style>
body { background: #0b0f19; color: #fff; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
.box { background: #131b2e; padding: 40px; border-radius: 16px; border: 1px solid #1e293b; width: 340px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); text-align: center; }
h2 { color: #f59e0b; margin-bottom: 25px; letter-spacing: 1px; font-size: 24px; }
input { width: 100%; padding: 14px; margin: 12px 0; background: #1a2642; border: 1px solid #2e3b59; color: #fff; border-radius: 8px; box-sizing: border-box; font-size: 14px; outline: none; }
input:focus { border-color: #f59e0b; }
button { width: 100%; padding: 14px; background: #f59e0b; border: none; color: #0b0f19; font-weight: bold; border-radius: 8px; cursor: pointer; margin-top: 15px; font-size: 16px; transition: 0.2s; }
button:hover { background: #d97706; }
.error { color: #ef4444; font-size: 13px; margin-top: 12px; }
</style>
</head>
<body>
<div class="box">
<h2>LUX PANEL</h2>
<form method="POST">
<input type="text" name="username" placeholder="İstifadəçi adı" required>
<input type="password" name="password" placeholder="Şifrə" required>
<button type="submit">Daxil ol</button>
</form>
<div class="error">${errorMsg}</div>
</div>
</body>
</html>`;
  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}
// Uğurlu Girişdən Sonra Açılan Əsas Panel Səhifəsi
function htmlDashboardResponse() {
  const html = `<!DOCTYPE html>
<html lang="az">
<head>
<meta charset="UTF-8">
<title>Lux Panel - İdarəetmə Paneli</title>
<style>
body { background: #0b0f19; color: #fff; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; }
.container { max-width: 900px; margin: 0 auto; }
header { display: flex; justify-content: space-between; align-items: center; background: #131b2e; padding: 20px; border-radius: 12px; border: 1px solid #1e293b; margin-bottom: 20px; }
h1 { color: #f59e0b; margin: 0; font-size: 22px; }
.logout-btn { background: #ef4444; color: #fff; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: bold; text-decoration: none; }
.logout-btn:hover { background: #dc2626; }
.card { background: #131b2e; padding: 25px; border-radius: 12px; border: 1px solid #1e293b; margin-bottom: 20px; }
.balance { font-size: 28px; font-weight: bold; color: #10b981; margin: 10px 0; }
.btn { background: #f59e0b; color: #0b0f19; border: none; padding: 12px 20px; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 14px; }
.btn:hover { background: #d97706; }
</style>
</head>
<body>
<div class="container">
<header>
<h1>LUX PANEL - İdarəetmə</h1>
<a href="/logout" class="logout-btn">Çıxış et</a>
</header>
<div class="card">
<h3>Cari Balansınız</h3>
<div class="balance">0.00 AZN</div>
<button class="btn" onclick="alert('Ödəniş kartı inteqrasiyası növbəti mərhələdə qoşulacaq!')">Balansı Artır (+)</button>
<div class="card">
<h3>SMM Xidmətləri</h3>
<p>Burada Instagram, TikTok və digər xidmətlərin siyahısı yerləşəcək.</p>
</div>
</div>
</body>
</html>`;
  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}
