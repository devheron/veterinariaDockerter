import Swal from 'sweetalert2';

export function notifySuccess(message: string) {
  if (!message) return;
  Swal.fire({
    toast: true,
    position: 'top-end',
    icon: 'success',
    title: message,
    showConfirmButton: false,
    timer: 2200,
    timerProgressBar: true,
  });
}

export function notifyError(message: any) {
  // Normalize different shapes of error input coming from HttpClient
  let text = '';
  try {
    if (!message) {
      text = '';
    } else if (typeof message === 'string') {
      text = message;
    } else if (message.error) {
      // HttpErrorResponse often has .error which can be string or object
      if (typeof message.error === 'string') text = message.error;
      else text = JSON.stringify(message.error);
    } else if (message.message) {
      text = message.message;
    } else {
      text = JSON.stringify(message);
    }
  } catch (e) {
    text = 'Erro desconhecido';
  }
  // Log raw object for debugging
  try { console.error('notifyError:', message); } catch (e) {}

  // If text looks like JSON, pretty print inside a <pre>
  const isJsonLike = text.startsWith('{') || text.startsWith('[');
  if (isJsonLike) {
    let pretty = '';
    try { pretty = JSON.stringify(JSON.parse(text), null, 2); } catch (e) { pretty = text; }
    const escapeHtml = (str: string) => str.replace(/[&<>"'`]/g, (s) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '`': '&#96;' } as any)[s]);
    const html = `<pre style="text-align:left;white-space:pre-wrap">${escapeHtml(pretty)}</pre>`;
    Swal.fire({
      icon: 'error',
      title: 'Erro',
      html,
      width: 600,
    });
    return;
  }

  Swal.fire({
    icon: 'error',
    title: 'Erro',
    text,
  });
}

export default { notifySuccess, notifyError };
