// @flow

import * as React from 'react'
import { css, cx } from 'emotion'

type Props = {
  className: string,
}

const greenClass = css({
  color: 'green',
})

const styles = css({
  color: 'red',
})

const otherStyles = css({
  color: 'blue',
})

const Box = (props: Props) => <div className={styles} />

const BoxWithClass = props => <div className={cx('box', styles)} />

const BoxWithTemplateClass = props => (
  <div className={cx(`box ${greenClass}`, styles)} />
)

const BoxWithGreenClass = props => (
  <div
    className={cx(greenClass, styles, otherStyles)}
    style={{ background: 'white' }}
  />
)

const AnotherBox = props => {
  const className = cx('box', props.className, greenClass, styles)
  return <div className={cx(className, otherStyles)} />
}
