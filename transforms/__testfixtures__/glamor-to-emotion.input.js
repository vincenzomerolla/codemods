// @flow

import * as React from 'react'
import { css } from 'glamor'
import cn from 'classnames'

type Props = {
  className: string
}

const greenClass = css({
  color: 'green',
}).toString()

const styles = css({
  color: 'red',
})

const Box = (props: Props) => <div {...styles} />

const BoxWithClass = props => <div className="box" {...styles} />

const BoxWithGreenClass = props => <div className={greenClass} {...styles} />

const AnotherBox = props => {
  const className = cn('box', greenClass, styles.toString())
  return <div className={className} />
}
