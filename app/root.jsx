import {
    Links,
    Meta,
    Outlet,
    Scripts,
  } from "@remix-run/react";
  import "./tailwind.css";
  
  export default function App() {
    return (
      <html lang="zh-CN">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
          <meta name="theme-color" content="#2563eb" />
          <meta name="description" content="观赏鱼宠物管理应用" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content="鱼管理" />
          <link rel="manifest" href="/manifest.json" />
          <link
            rel="icon"
            href="data:image/x-icon;base64,AA"
          />
          <link rel="apple-touch-icon" href="/icon-192.png" />
          <Meta />
          <Links />
        </head>
        <body>
          <Outlet />
          <Scripts />
        </body>
      </html>
    );
  }
  