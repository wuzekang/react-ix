## Installation

```bash
npm install --save react-ix
```

## Quick start

- [useTakeLatest - live demo](https://codesandbox.io/s/gallant-stonebraker-r1mfy)

```jsx
import React from "react";
import { Card, Table, Input } from "antd";
import { useTakeLatest } from "react-ix/hooks";
import { ajax } from "rxjs/ajax";

import "antd/dist/antd.css";

const searchRepositories = query =>
  ajax.getJSON(
    `https://api.github.com/search/repositories?q=${query}&sort=stars&order=desc`
  );

function App() {
  const [response, search, loading] = useTakeLatest(searchRepositories)(
    "react-ix"
  );

  return (
    <Card
      title={
        <Input.Search
          defaultValue="react-ix"
          onSearch={value => {
            if (value) {
              search(value);
            }
          }}
        />
      }
    >
      <Table
        loading={loading}
        columns={[
          {
            key: "id",
            dataIndex: "id",
            title: "ID"
          },
          {
            key: "name",
            dataIndex: "name",
            title: "Name"
          },
          {
            key: "description",
            dataIndex: "description",
            title: "Description"
          }
        ]}
        dataSource={response ? response.items : []}
        pagination={false}
      />
    </Card>
  );
}
```

## API Reference

### useTakeEvery

```ts
function useTakeEvery<T, R>(
  project: UnaryFunction<T, Observable<R>>,
  concurrent?: number | undefined
): (
  initialSource: T,
  initialResult?: Optional<R>
) => [
  Optional<R>,
  (source: T) => Subject<R>,
  boolean,
  Error | undefined
]
```

### useTakeLatest

```ts
function useTakeLatest<T, R>(
  project: UnaryFunction<T, Observable<R>>
): (
  initialSource: T,
  initialResult?: Optional<R>
) => [
  Optional<R>,
  (source: T) => Subject<R>,
  boolean,
  Error | undefined
]
```

### useTakeLeading

```ts
function useTakeLeading<T, R>(
  project: UnaryFunction<T, Observable<R>>
): (
  initialSource: T,
  initialResult?: Optional<R>
) => [
  Optional<R>,
  (source: T) => Subject<R>,
  boolean,
  Error | undefined
]
```