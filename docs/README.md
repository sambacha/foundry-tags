---
title: Accretive Versioning
description: |
 Accretive Versioning: an Automated compatibility scheme for providing an Immutable Compatibility in Theory
author: Sam Bacha
---

# Accretive Versioning: an Automated compatibility scheme

slide title: "Semantic" Versioning
                  "Semantics"

+ 1.2.changed

  + "you don't care"

+ 1.changed.0

  + "you don't care"

+ changed.0.0

  + "you're screwed"


Precisely because SemVer is a sociological and not only a technical contract, the problem is tractable: We define a breaking change as above, and accept the reality that some changes are not preventable (but may in many cases be mitigated or fixed automatically). This is admittedly unsatisfying, but we believe it satisfies our constraints.

We see two orthogonal problems when importing an external module:

- Availability: Will A be available at the host site?
- Compatibility: Will the version of A available at the host be compatible with P?

## ABI

> a generated contract ABI interface; as described in the ABI generated artifact; is called an ABI definition. Each ABI definition has an associated ABI identifier; e.g. constant, inputs, outputs, stateMutability, payable, type, name (which may be implicit in the case of Contract).

| Specification Key 	| Key Description 	|
|---	|---	|
| Revision 	| Let x be a module definition and X be its associated module identifier. We call x a revision of X. 	|
| Module 	| The module named X is defined as the set of all revisions of X. More formally; let x be a revision of X; y be a revision of Y; and call x and y related iff X=Y. We then call the equivalence classes of this relation module and their associated identifiers - unique within the class - the modules' names. 	|
| Interface 	| The set of entities (functions; classes; instances; etc.) exported from a module is called its interface. 	|
| Compatibility 	| Two revisions are called (mutually) compatible; if their interfaces are equal and all exported entities have the same semantics. 	|
| Version 	| The equivalence classes of the compatibility relation; restricted to a single module X; are called versions of X. 	|


### ABI Interface

Now, say you are implementing ABI interface A. To fully conform to the protocol concerning A, simply ensure the following invariants.

<pre>
Let all versions of A be numbered from 1 to n.

For each i=1,...,n there exists a module A_i whose only version is equal to version i of A.
Version n contains the latest revision of A.
Module A is deprecated using a DEPRECATED natspec, with a message that A_n should be imported instead.
</pre>

Example:
```solidity
/// @custom:deprecated
```
</pre>

## Accreting collection of Immutable Things

> Use Lamport-like logic to know what they could not have seen


Accretive versioning is based on matching type signatures against a generated ABI V2. 


> Imagine a package manager that ran the test suite of the version you're currently using against the code of the version you'd like to upgrade to, and told you exactly what wasn't going to work.


### Specification

Contract Interface names MUST NOT use the following [Unicode] characters:

<pre>
SOLIDUS: / (U+002F)

QUOTATION MARK: " (U+0022)

ASTERISK: * (U+002A)

FULL STOP as the last character: . (U+002E)

COLON: : (U+003A)

LESS-THAN SIGN: < (U+003C)

GREATER-THAN SIGN: > (U+003E)

QUESTION MARK: ? (U+003F)

REVERSE SOLIDUS: \ (U+005C)

VERTICAL LINE: \ (U+007C)

DEL (U+007F)

C0 range (U+0000 … U+001F)

C1 range (U+0080 … U+009F)

Private Use Area (U+E000 … U+F8FF)

Non characters in Arabic Presentation Forms-A (U+FDD0 … U+FDEF)

Specials (U+FFF0 … U+FFFF)

Tags and Variation Selectors Supplement (U+E0000 … U+E0FFF)

Supplementary Private Use Area-A (U+F0000 … U+FFFFF)

Supplementary Private Use Area-B (U+100000 … U+10FFFF)
</pre>


```protobuf

syntax = "proto2";

// bool
message BoolType {}

// uint8...256, int8...256
message IntegerType {
    required bool is_signed = 1;
    required uint32 width = 2;
}

// bytes1, bytes2,..., bytes32
message FixedByteType {
    required uint32 width = 1;
}

// address
message AddressType {}

message ValueType {
    oneof value_type_oneof {
        IntegerType inty = 1;
        FixedByteType byty = 2;
        AddressType adty = 3;
        BoolType boolty = 4;
    }
}

// bytes
message DynamicByteArrayType {}

message ArrayType {
    required Type t = 1;
    required uint32 length = 2;
    required bool is_static = 3;
}

message StructType {
    repeated Type t = 1;
}

message NonValueType {
    oneof nonvalue_type_oneof {
        DynamicByteArrayType dynbytearray = 1;
        ArrayType arrtype = 2;
        StructType stype = 3;
    }
}

// TODO: Add more types
// See https://github.com/ethereum/solidity/issues/6749
message Type {
    oneof type_oneof {
        ValueType vtype = 1;
        NonValueType nvtype = 2;
    }
}

message VarDecl {
    required Type type = 1;
}

message TestFunction {
    required VarDecl local_vars = 1;
    // Length of invalid encoding
    required uint64 invalid_encoding_length = 2;
}

message Contract {
    enum Test {
        CALLDATA_CODER = 1;
        RETURNDATA_CODER = 2;
    }
    required VarDecl state_vars = 1;
    required TestFunction testfunction = 2;
    required Test test = 3;
}

package ethereum.versioning.schema.abiV2;

---

# Reference, Haskell PVP

## Version numbers[🔗](https://pvp.haskell.org/#version-numbers)

The key words “MUST”, “MUST NOT”, “REQUIRED”, “SHALL”, “SHALL NOT”, “SHOULD”, “SHOULD NOT”, “RECOMMENDED”, “MAY”, and “OPTIONAL” in this document are to be interpreted as described in [RFC 2119](https://tools.ietf.org/html/rfc2119).

A package version number **SHOULD** have the form _A.B.C_, and **MAY** optionally have any number of additional components, for example 2.1.0.4 (in this case, _A_\=2, _B_\=1, _C=0_). This policy defines the meaning of the first three components _A-C_, the other components can be used in any way the package maintainer sees fit.

Version number ordering is already defined by Cabal as the lexicographic ordering of the components. For example, 2.0.1 > 1.3.2, and 2.0.1.0 > 2.0.1. (The `Data.Version.Version` type and its `Ord` instance embody this ordering).

_A.B_ is known as the _major_ version number, and _C_ the _minor_ version number. When a package is updated, the following rules govern how the version number must change relative to the previous version:

1.  _Breaking change_. If any entity was removed, or the types of any entities or the definitions of datatypes or classes were changed, or orphan instances were added or any instances were removed, then the new _A.B_ **MUST** be greater than the previous _A.B_. Note that modifying imports or depending on a newer version of another package may cause extra orphan instances to be exported and thus force a major version change.
    
2.  _Non-breaking change_. Otherwise, if only new bindings, types, classes, non-orphan instances or modules (but see below) were added to the interface, then _A.B_ **MAY** remain the same but the new _C_ **MUST** be greater than the old _C_. Note that modifying imports or depending on a newer version of another package may cause extra non-orphan instances to be exported and thus force a minor version change.
    
3.  _Other changes_. Otherwise, e.g. if change consist only of corrected documentation, non-visible change to allow different dependency range etc. _A.B.C_ **MAY** remain the same (other version components may change).
    
4.  _Client specification_. Hence _A.B.C_ uniquely identifies the API. A client that wants to specify that they depend on a particular version of the API can specify a particular _A.B.C_ and be sure of getting that API only. For example, `build-depends: mypkg >= 2.1.1 && < 2.1.2`.
    
5.  _Backwards compatible client specification_. Often a package maintainer wants to add to an API without breaking backwards compatibility, and in that case they can follow the rules of point 2, and increase only _C_. A client **MAY** specify that they are [insensitive to additions to the API](https://wiki.haskell.org/Import_modules_properly) by allowing a range of _C_ values, e.g. `build-depends: base >= 2.1.1 && < 2.2`.
    
6.  _Client defines orphan instance_. If a package defines an orphan instance, it **MUST** depend on the minor version of the packages that define the data type and the type class to be backwards compatible. For example, `build-depends: mypkg >= 2.1.1 && < 2.1.2`.
    
7.  _Deprecation_. Deprecated entities (via a `DEPRECATED` pragma) _SHOULD_ be counted as removed for the purposes of upgrading the API, because packages that use `-Werror` will be broken by the deprecation. In other words the new _A.B_ **SHOULD** be greater than the previous _A.B_.
    
8.  _Adding new modules_. Adding new modules might cause an unavoidable name collision in dependent code. However, this is usually pretty unlikely, especially if you keep to your own namespace, so only an increase of the minor version number is required, in other words _A.B_ **MAY** remain the same the new _C_ **MUST** be greater than the old _C_. If, however, your added module name is taken from another package (e.g. when `network-bytestring` was merged into `network`) or is quite general (`Data.Set` or something similar) then the version increase **SHOULD** be major.
    

## Special situations[🔗](https://pvp.haskell.org/#special-situations)

### Leaking instances[🔗](https://pvp.haskell.org/#leaking-instances)

There is a case where addition or removal of an instance in a package that the user doesn’t depend on directly can still lead to compilation failures. Consider these three packages:

Package A:

```
module PackageA where

class Monad m => MonadLogger m
instance MonadLogger IO
```

Package B, depends on package A:

```
module PackageB where

import PackageA

f :: MonadLogger m => Int -> m String
f = return . show
```

Package C, depends on package B:

```
module Package C where

import PackageB

main :: IO ()
main = f 5 >>= print
```

Now consider this scenario:

1.  Package A removes the `IO` instance and gets its major version number bumped, as required by the PVP.
2.  Package B, which can still work with the old and new version of package A, changes its dependency on package A to allow for both versions. Package B only gets a patch-level bump.
3.  Package C might or might not compile, depending on which patch-level version of package B is used.

The PVP could require that package B must bump its major version number as it now (re-)exports one fewer instances. This will however require more frequent version bumps in the whole ecosystem. As a pragmatic solution, for now the PVP doesn’t required a major version bump in this case and instead leaves it to package C to add a dependency on package A to handle this situation.

### Version tags[🔗](https://pvp.haskell.org/#version-tags)

The components of the version number **MUST** be numbers! Historically Cabal supported version numbers with string tags at the end, e.g. `1.0-beta` This proved not to work well because the ordering for tags was not well defined. Version tags are [no longer supported](https://github.com/haskell/cabal/issues/890) and mostly ignored, however some tools will fail in some circumstances if they encounter them.

This can sometimes trip you up if you accidentally stumble into using the deprecated tags syntax without realising it, for example a version number with a date like `1.0.2014-01-27` would be interpreted as the version `1.0.2014` with tags `01` and `27`.

## Decision Tree[🔗]


## Version syntax[🔗](https://pvp.haskell.org/#version-syntax)

Since Cabal 1.6, you can specify an exact API version according to this policy with the special syntax `package == 1.1.4.*` or an API version up to additions with `package == 1.1.*`. The former translates into `package >= 1.1.4 && < 1.1.5`, for example - notice that 1.1.4 _is_ included, rather than just including 1.1.4.0.


### References 
-   [PVP Versioning, Haskell](https://pvp.haskell.org/) Accessed 2022 July 
-   Sven Moritz Hallberg, “[Eternal compatibility in theory](https://wiki.haskell.org/The_Monad.Reader/Issue2/EternalCompatibilityInTheory),” [The Monad.Reader](https://wiki.haskell.org/The_Monad.Reader), [Issue 2](https://wiki.haskell.org/The_Monad.Reader/Issue2)
-   [Semantic Versioning (SemVer)](http://semver.org/) specifies a versioning scheme sharing similiarities with the PVP; but it also differs significantly in some aspects. For more details, consult the [**PVP↔SemVer FAQ section**](https://pvp.haskell.org/faq/#semver).
