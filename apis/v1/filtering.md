---
aside: true
outline: deep
---

# Filtering

Endpoints that list resources support filtering.

When a filter URL parameter can be used, it will be documented in the endpoint's documentation.

The parameter should be a JSON object with the following (optional) keys...

## fields

**Type: Object or Array**

Specify fields to include in or exclude from the response.

For example:

```json
{ fields: {location: true, timestamp: true } }
```

Or:

```json
{ fields: ["location", "timestamp"] }
```

## limit

**Type: Number**

Limit the number of instances to return.

For example:

```json
{limit: 5}
```

## order

**Type: String**

Specify sort order: ascending or descending.

For example:

```json
order: 'timestamp DESC'
```

or for multiple properties

```json
{ order: ['propertyName <ASC|DESC>’, 'propertyName <ASC|DESC>',...] }
```

## skip (offset)

**Type: Number**

Skip the specified number of instances.

For example:

```json
{skip: 50}
```

## where

**Type: Object**

Specify search criteria; similar to a WHERE clause in SQL.

Where clauses look like:

```json
{where: {property: value}}
```

Or, to use an operation

```json
{where: {property: {op: value}}}
```

Where op can be one of the following:

### and

logical and

```json
{where: {and: [condition1, condition2, ...]}}
```

### or

logical or

```json
{where: {or: [condition1, condition2, ...]}}
```

### gt, gte

greater than, greater than or equal

```json
{where: {timestamp: {gt: 1510332638000 }}}
```

To get all points since 16:50:38 on 10 Nov 2017 (unix timestamp in milliseconds)

### lt, lte

less than, less than or equal

### between

True if the value is between the two specified values: greater
than or equal to first value and less than or equal to second
value.

```json
{where: {timestamp: {between: [1509900638000,1510332638000] }}}
```

To get all points between 16:50:38 on 5 Nov 2017 and 16:50:38
on 10 Nov 2017

### inq, nin

In / not in an array of values

### near

For geolocations, return the closest points, sorted in order of
distance. Use with limit to return the n closest points.

### neq

not equal to
