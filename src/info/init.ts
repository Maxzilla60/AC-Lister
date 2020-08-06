import { html } from '../../public/README.md';
import { getElement as $ } from '../shared/util';

const childNodes = new DOMParser().parseFromString(html, 'text/html').body.childNodes;
const articleElement = document.createElement('article');
childNodes.forEach(n => articleElement.appendChild(n));
$('readme_container').appendChild(articleElement);
