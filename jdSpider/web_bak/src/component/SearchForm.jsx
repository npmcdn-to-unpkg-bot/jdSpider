import { Form, Input, Button, Checkbox } from 'antd';
import React from 'react'
const FormItem = Form.Item;

let Demo = React.createClass({
  handleSubmit(e) {
    // e.preventDefault();
    console.log('收到表单值：', this.props.form.getFieldsValue());
  },

  render() {
    const { getFieldProps } = this.props.form;
    return (
      <Form inline onChange={this.handleSubmit}>
        <FormItem
          label="搜索：">
          <Input placeholder="请输入商品ID"
            {...getFieldProps('userName')} />
        </FormItem>
      </Form>
    );
  },
});

Demo = Form.create()(Demo);

export default Demo;
