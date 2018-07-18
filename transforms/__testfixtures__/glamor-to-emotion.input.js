// @flow

import * as React from 'react'
import { css } from 'glamor'
import cn from 'classnames'

type Props = {
  className: string,
}

const greenClass = css({
  color: 'green',
}).toString()

const styles = css({
  color: 'red',
})

const otherStyles = css({
  color: 'blue',
})

const Box = (props: Props) => <div {...styles} />

const BoxWithClass = props => <div className="box" {...styles} />

const BoxWithTemplateClass = props => (
  <div className={`box ${greenClass}`} {...styles} />
)

const BoxWithGreenClass = props => (
  <div
    className={greenClass}
    style={{ background: 'white' }}
    {...styles}
    {...otherStyles}
  />
)

const AnotherBox = props => {
  const className = cn('box', props.className, greenClass, styles.toString())
  return <div className={className} {...otherStyles} />
}
