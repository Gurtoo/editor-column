import { make } from '@groupher/editor-utils'
/**
 * Build styles
 */
import css from "./index.css";
import tippy, { hideAll } from 'tippy.js'
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light.css';

/**
 * Column Block for the Editor.js.
 *
 * @author CodeX (team@ifmo.su)
 * @copyright CodeX 2018
 * @license The MIT License (MIT)
 * @version 2.0.0
 */

/**
 * @typedef {Object} DelimiterData
 * @description Tool's input and output data format
 */
export default class Column {
  /**
   * Allow Tool to have no content
   * @return {boolean}
   */
  static get contentless() {
    return true;
  }

  /**
   * Get Tool toolbox settings
   * icon - Tool icon's SVG
   * title - title to show in toolbox
   *
   * @return {{icon: string, title: string}}
   */
  static get toolbox() {
    return {
      icon: `<svg width="20" t="1576241814103" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2955" width="200" height="200"><path d="M800 613.546667h-192v-42.666667a42.666667 42.666667 0 0 1 42.666667-42.666667h106.666666a42.666667 42.666667 0 0 1 42.666667 42.666667z" p-id="2956"></path><path d="M768 464.213333h-128a32.426667 32.426667 0 0 1-32-32.426666 32 32 0 0 1 32-31.573334h128a32 32 0 0 1 32 31.573334 32.426667 32.426667 0 0 1-32 32.426666zM384 464.213333H256a32.426667 32.426667 0 0 1-32-32.426666 32 32 0 0 1 32-31.573334h128a32 32 0 0 1 32 31.573334 32.426667 32.426667 0 0 1-32 32.426666zM384 602.453333H256a32 32 0 0 1-32-31.573333 32.426667 32.426667 0 0 1 32-32.426667h128a32.426667 32.426667 0 0 1 32 32.426667 32 32 0 0 1-32 31.573333z" p-id="2957"></path><path d="M512 885.333333a32.426667 32.426667 0 0 1-14.08-3.413333l-13.653333-6.4a305.066667 305.066667 0 0 0-138.24-32.853333H181.333333a85.333333 85.333333 0 0 1-85.333333-85.333334V266.666667a85.333333 85.333333 0 0 1 85.333333-85.333334h164.693334a375.893333 375.893333 0 0 1 165.973333 39.253334l13.653333 6.826666a32.426667 32.426667 0 0 1 17.493334 28.586667v597.333333a31.573333 31.573333 0 0 1-15.36 27.306667 32.853333 32.853333 0 0 1-15.786667 4.693333z m-330.666667-640a21.333333 21.333333 0 0 0-21.333333 21.333334v490.666666a21.333333 21.333333 0 0 0 21.333333 21.333334h164.693334a378.453333 378.453333 0 0 1 133.973333 24.746666V275.626667a315.306667 315.306667 0 0 0-133.973333-30.293334z"  p-id="2958"></path><path d="M512 885.333333a32.853333 32.853333 0 0 1-16.64-4.693333 31.573333 31.573333 0 0 1-15.36-27.306667V256a32 32 0 0 1 21.76-30.293333l75.52-25.173334a370.773333 370.773333 0 0 1 118.186667-19.2h147.2a85.333333 85.333333 0 0 1 85.333333 85.333334v490.666666a85.333333 85.333333 0 0 1-85.333333 85.333334h-164.693334a305.066667 305.066667 0 0 0-138.24 32.853333l-13.653333 6.4a32.426667 32.426667 0 0 1-14.08 3.413333z m32-606.293333v524.373333a378.453333 378.453333 0 0 1 133.973333-24.746666h164.693334a21.333333 21.333333 0 0 0 21.333333-21.333334V266.666667a21.333333 21.333333 0 0 0-21.333333-21.333334H695.466667a316.586667 316.586667 0 0 0-98.133334 15.786667z" p-id="2959"></path></svg>`,
      title: "分栏 (Column)"
    };
  }

  /**
   * Render plugin`s main Element and fill it with saved data
   *
   * @param {{data: DelimiterData, config: object, api: object}}
   *   data — previously saved data
   *   config - user config for Tool
   *   api - Editor.js API
   */
  constructor({ data, config, api }) {
    this.api = api;

    this.CSS = {
      block: this.api.styles.block,
      wrapper: "cdx-column",
      innerWrapper: "cdx-column-inner-wrapper",
      column: "cdx-column-part",
      columnHead: "cdx-column-head",
      columnSpot: "cdx-column-spot",
      columnTitle: "cdx-column-title",
      columnBody: "cdx-column-body"
    };

    this.data = {
      title: data.title || "",
      content: data.content || ""
    };

    this.TitleInput = null;
    this.CollapseContent = null;

    this._element = this.drawView();
    this.data = data;
  }

  /**
   * Create Tool's view
   * @return {HTMLElement}
   * @private
   */
  drawView() {
    const Wrapper = make("DIV", [this.CSS.block, this.CSS.wrapper], {});
    const InnerWrapper = make("DIV", [this.CSS.innerWrapper], {
      // innerHTML: this.drawColumn()
    });

    InnerWrapper.appendChild(this.drawColumn());
    InnerWrapper.appendChild(this.drawColumn());
    Wrapper.appendChild(InnerWrapper);

    return Wrapper;
  }

  /**
   * Create left or right column
   * @return {HTMLElement}
   * @private
   */
  drawColumn() {
    const Wrapper = make("DIV", [this.CSS.column]);
    const Head = make("DIV", [this.CSS.columnHead]);
    const Spot = make("DIV", [this.CSS.columnSpot]);
    const Title = make("DIV", [this.CSS.columnTitle], {
      // innerText: "配置选项是 FAQ",
      contentEditable: true,
      placeholder: "输入标题 ..."
    });

    const Body = make("DIV", [this.CSS.columnBody], {
      // innerText: "",
      placeholder: "输入内容 ...",
      contentEditable: true
    });

    Head.appendChild(Spot);
    Head.appendChild(Title);

    Wrapper.appendChild(Head);
    Wrapper.appendChild(Body);

    this.api.listeners.on(Spot, 'click', () => {
      console.log('Button clicked tippy ! ');
      tippy(Spot, this.drawSpotSelector())
      // this.api.tooltip.show(Spot, this.drawSpotSelector(), {});
    }, false);

    return Wrapper;
  }

  drawSpotSelector() {
    const Wrapper = make('div', ["cdx-color-selector"])
    const Dot = make('div', ["cdx-color-selector-dot", "cdx-color-selector-dot--primary"])
    const Dot2 = make('div', ["cdx-color-selector-dot", "cdx-color-selector-dot--red"])
    const Dot3 = make('div', ["cdx-color-selector-dot", "cdx-color-selector-dot--warning"])
    const Dot4 = make('div', ["cdx-color-selector-dot", "cdx-color-selector-dot--green"])

    this.api.listeners.on(Dot, 'click', () => {
      console.log('spot clicked!');
      // this.api.tooltip.show(Spot, this.drawSpotSelector(), {});
    }, false);

    Wrapper.appendChild(Dot)
    Wrapper.appendChild(Dot2)
    Wrapper.appendChild(Dot3)
    Wrapper.appendChild(Dot4)
  
    return {
      content: Wrapper,
      theme: 'light',
      // delay: 200,
      trigger: "click",
      placement: 'bottom',
      // allowing you to hover over and click inside them.
      interactive: true,
    }
    // return Wrapper
  }

  /**
   * Return Tool's view
   * @returns {HTMLDivElement}
   * @public
   */
  render() {
    return this._element;
  }

  /**
   * Extract Tool's data from the view
   * @param {HTMLDivElement} toolsContent - Paragraph tools rendered view
   * @returns {DelimiterData} - saved data
   * @public
   */
  save(toolsContent) {
    return {};
  }
}
