import {Component, ReactElement} from 'react';
import {unmountComponentAtNode, render} from 'react-dom';

export interface IProps {
  // tslint:disable
  children: ReactElement<any>;
  boxClass?: string;
  callBack?: () => void; // 渲染回调 - 每次render都会调用
  mount?: boolean; // 用于开启懒加载 当为true时进行渲染
  zIndex?: number;
}

export interface IStatus {

}

// 根节点渲染HOC
export class RenderInRootDom extends Component<IProps, IStatus> {
  box: HTMLElement;
  renderFlag: boolean = false; // 判断是否已经渲染过
  static defaultProps = {
    mount: true,
    zIndex: 1000,
  }

  renderChild = () => {
    const {boxClass, zIndex} = this.props;
    this.box = document.createElement("div");
    if (boxClass) {
      this.box.setAttribute('class', boxClass);
    }
    this.box.style.position = 'absolute';
    this.box.style.zIndex = zIndex + '';
    this.box.style.left = '0';
    this.box.style.top = '0';
    document.body.appendChild(this.box);
    this._renderLayer();
  }

  // 在根节点下渲染children
  componentDidMount() {
    const {mount} = this.props;
    if (mount) {
      this.renderFlag = true;
      this.renderChild();
    }
  }

  // 节点更新
  componentDidUpdate() {
    const {mount} = this.props;
    if (mount && !this.renderFlag) {
      this.renderFlag = true;
      this.renderChild();
    } else {
      this._renderLayer();
    }
  }

  // 组件卸载时移除渲染节点
  componentWillUnmount() {
    if (this.renderFlag) {
      unmountComponentAtNode(this.box);
      document.body.removeChild(this.box);
    }
  }

  // 渲染方法
  _renderLayer() {
    if (this.renderFlag) {
      render(this.props.children, this.box, this.props.callBack);
    }
  }

  render() {
    return null;
  }
}
