// @flow

import * as React from 'react'
import { css, cx } from 'emotion';

type Props = {
  className: string
}

const greenClass = css({
  color: 'green',
})

const styles = css({
  color: 'red',
})

const Box = (props: Props) => <div className={styles} />

const BoxWithClass = props => <div className={cx('box', styles)} />

const BoxWithGreenClass = props => <div className={cx(greenClass, styles)} />

const AnotherBox = props => {
  const className = cx('box', greenClass, styles)
  return <div className={className} />
}
