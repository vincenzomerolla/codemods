// @flow

import { cx, css } from 'emotion';

css({
  color: 'green'
});

const styles = css({
  color: 'red'
});

const Box = props => <div className={styles} />;

const BoxWithClass = props => <div className={cx('box', styles)} />;

const AnotherBox = props => {
  const className = cx('box', greenClass, styles);
  return <div className={className} />;
};
