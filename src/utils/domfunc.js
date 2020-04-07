/* eslint-disable no-param-reassign */


export function addLoadingMessage(message, element) {
  element.disabled = true;
  const html = `<span class="loader"></span>
    ${message}
    `;
  element.innerHTML = html;
}

export function removeLoading(element) {
  element.innerHTML = 'Generer ordsky';
  element.disabled = false;
}
