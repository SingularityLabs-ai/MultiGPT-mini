# react-node-to-string

## Extract string from React node.

This project was developed to extract string from `React.ReactNode` object.

## Installation

```console
$ npm install react-node-to-string --save
```

## Usage

```tsx
import { ReactNode } from "react"
import reactNodeToString from "react-node-to-string"

const node: ReactNode = (
  <p>
    <strong>lorem</strong>ipsum
  </p>
)

console.log(reactNodeToString(node))

// loremipsum
```

## Licence

MIT
