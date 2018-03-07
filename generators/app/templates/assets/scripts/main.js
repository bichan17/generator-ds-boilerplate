<%_ if (config.libraries.includes('jquery')) { _%>
import jQuery from 'jquery';
<%_ } _%>
<%_ if (config.libraries.includes('picturefill')) { _%>
import 'picturefill';
<%_ } _%>
<%_ if (config.libraries.includes('jquery')) { _%>

window.$ = window.jQuery = jQuery;
<%_ } _%>
