'use strict';
(() => {
  const viewer = document.querySelector('#image-viewer');
  const sheet = document.querySelector('.sheet-link');
  const scroller = document.querySelector('#viewer-scroll');
  const zoom = document.querySelector('#zoom-image');
  const help = document.querySelector('#viewer-help');
  let previousOverflow = '';
  let returnFocus;
  function resetZoom() {
    scroller.classList.remove('is-zoomed');
    zoom.setAttribute('aria-pressed', 'false');
    zoom.textContent = '查看細節';
    help.textContent = '目前顯示全圖。放大後可捲動查看細節；按 Esc 或「關閉」返回。';
    scroller.scrollTo(0, 0);
  }
  if (viewer && sheet && typeof viewer.showModal === 'function') {
    sheet.setAttribute('aria-haspopup', 'dialog');
    sheet.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      returnFocus = document.activeElement;
      previousOverflow = document.body.style.overflow;
      resetZoom();
      viewer.showModal();
      document.body.style.overflow = 'hidden';
    });
    document.querySelector('#close-viewer').addEventListener('click', () => viewer.close());
    viewer.addEventListener('close', () => {
      document.body.style.overflow = previousOverflow;
      resetZoom();
      if (returnFocus) returnFocus.focus({preventScroll: true});
    });
    zoom.addEventListener('click', () => {
      const isZoomed = scroller.classList.toggle('is-zoomed');
      zoom.setAttribute('aria-pressed', String(isZoomed));
      zoom.textContent = isZoomed ? '顯示全圖' : '查看細節';
      help.textContent = isZoomed ? '目前已放大。可左右、上下捲動，或聚焦圖片區後用方向鍵查看細節。' : '目前顯示全圖。放大後可捲動查看細節；按 Esc 或「關閉」返回。';
      scroller.scrollTo(0, 0);
    });
  }
  const status = document.querySelector('.copy-status');
  document.querySelectorAll('[data-copy]').forEach(button => {
    button.addEventListener('click', async () => {
      const text = button.dataset.copy;
      const oldInput = document.querySelector('.copy-manual');
      if (oldInput) oldInput.remove();
      try {
        await navigator.clipboard.writeText(text);
        status.textContent = '已複製 ' + text;
      } catch {
        status.textContent = '請選取下方標籤文字複製：';
        const input = document.createElement('input');
        input.className = 'copy-manual';
        input.readOnly = true;
        input.value = text;
        input.setAttribute('aria-label', '選取並複製標籤');
        status.after(input);
        input.focus();
        input.select();
      }
    });
  });
})();
