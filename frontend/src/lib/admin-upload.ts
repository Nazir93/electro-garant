/**
 * Загрузка файла в /public/uploads через защищённый /api/admin/upload
 */
export async function uploadAdminMedia(file: File): Promise<{ url?: string; error?: string }> {
  const fd = new FormData();
  fd.append("file", file);
  try {
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = (await res.json()) as { url?: string; error?: string };
    if (!res.ok) return { error: data.error || "Ошибка загрузки" };
    if (data.url) return { url: data.url };
    return { error: "Сервер не вернул адрес файла" };
  } catch {
    return { error: "Не удалось отправить файл" };
  }
}
