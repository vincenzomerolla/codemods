// @flow

import { css } from 'glamor';
import cn from 'classnames';

css({
  color: 'green'
}).toString();

const styles = css({
  color: 'red'
});

const Box = props => <div {...styles} />;

const BoxWithClass = props => <div className="box" {...styles} />;

const AnotherBox = props => {
  const className = cn('box', greenClass, styles.toString());
  return <div className={className} />;
};
