/**
 * Created by yh on 5/10/16.
 */
import React from 'react';
import { Button } from 'antd';

const ButtonTest = React.createClass({
  render() {
    return <div>
      <Button type="primary">主按钮</Button>
      <Button>次按钮</Button>
      <Button type="ghost">幽灵按钮</Button>
      <Button type="dashed">虚线按钮</Button>
    </div>;
  }
});

export default ButtonTest;
