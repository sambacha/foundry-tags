# Foundry/Etherspack Tags

> 

## Motivation

Automate tagging/releases process. Be less involved than `semantic-release`

## Usage

### Tagging Releases

By default, if you do not pass a `tags` input this action will use an algorithm based on the state of your git repo to determine the Foundry/DPack tag(s). 
Below is a table detailing how the GitHub trigger (branch or tag) determines the Foundry tag(s).

| Trigger                  | Commit SHA | addLatest | addTimestamp | Foundry Tag(s)                         |
| ------------------------ | ---------- | --------- | ------------ | -------------------------------------- |
| /refs/tags/v1.0          | N/A        | false     | N/A          | v1.0                                   |
| /refs/tags/v1.0          | N/A        | true      | N/A          | v1.0,latest                            |
| /refs/heads/dev          | 1234567    | false     | true         | dev-1234567-2021-09-01.195027          |
| /refs/heads/dev          | 1234567    | true      | false        | dev-1234567,latest                     |
| /refs/heads/master       | 1234567    | false     | true         | master-1234567-2021-09-01.195027       |
| /refs/heads/master       | 1234567    | true      | false        | master-1234567,latest                  |
| /refs/heads/SOME-feature | 1234567    | false     | true         | some-feature-1234567-2021-09-01.195027 |
| /refs/heads/SOME-feature | 1234567    | true      | false        | some-feature-1234567,latest            |


## License

Apache-2.0 and/or MIT