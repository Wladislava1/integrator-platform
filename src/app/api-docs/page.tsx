"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

/**
 * Swagger UI через CDN — без тяжёлого swagger-ui-react.
 * Спека: /openapi.json
 */
export default function ApiDocsPage() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cssId = "swagger-ui-css";
    if (!document.getElementById(cssId)) {
      const link = document.createElement("link");
      link.id = cssId;
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/swagger-ui-dist@5.17.14/swagger-ui.css";
      document.head.appendChild(link);
    }

    const scriptId = "swagger-ui-bundle";
    const boot = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SwaggerUIBundle = (window as any).SwaggerUIBundle;
      if (!SwaggerUIBundle || !hostRef.current) return;
      hostRef.current.innerHTML = "";
      SwaggerUIBundle({
        url: "/openapi.json",
        domNode: hostRef.current,
        deepLinking: true,
        docExpansion: "list",
        defaultModelsExpandDepth: 1,
      });
    };

    if (document.getElementById(scriptId)) {
      boot();
      return;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://unpkg.com/swagger-ui-dist@5.17.14/swagger-ui-bundle.js";
    script.onload = boot;
    document.body.appendChild(script);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-[var(--border)] bg-[var(--brand-soft)] px-4 py-3">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold text-[var(--brand-strong)]">
              Swagger — Связь ID API
            </h1>
            <p className="text-sm text-[var(--muted)]">
              Спецификация OpenAPI 3: регистрация, вход, профиль, тема
            </p>
          </div>
          <Link
            href="/login"
            className="rounded-lg border border-[var(--border)] bg-white px-3 py-1.5 text-sm hover:bg-[var(--brand-soft)]"
          >
            К приложению
          </Link>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-2 py-4">
        <div ref={hostRef} />
      </div>
    </div>
  );
}
