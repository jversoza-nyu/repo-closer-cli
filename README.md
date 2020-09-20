# Repo Closer
___

## Installation

```
# after cloning...
npm install
# edit config file
# add students file to directory
```

## Usage

```
> node main.js close [repo-name]
> node main.js open [repo-name]
```

where [repo-name] is the name of the repo (not including the team name)
for example:

```
> node main.js close homework1
```

will close all repos [team name]-homework1

Make sure config.js contains the correct org name, your username, and either your password or API access token.
Make sure students contains all teams whose repos you want to close.
