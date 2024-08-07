import {
  NavbarSecondaryMenuFiller,
  useWindowSize,
} from '@docusaurus/theme-common';
import CopyIcon from '@theme/Icon/Copy';
import IconExternalLink from '@theme/Icon/ExternalLink';
import SuccessIcon from '@theme/Icon/Success';
import React, { useCallback, useMemo } from 'react';
import semverSatisfies from 'semver/functions/satisfies';

import { useClipboard } from '../hooks/useClipboard';
import Checkbox from './inputs/Checkbox';
import Dropdown from './inputs/Dropdown';
import Tooltip from './inputs/Tooltip';
import ActionLabel from './layout/ActionLabel';
import Expander from './layout/Expander';
import InputLabel from './layout/InputLabel';
import { createMarkdown, createMarkdownParams } from './lib/markdown';
import { fileTypes } from './options';
import type { ConfigModel } from './types';

export interface OptionsSelectorParams {
  readonly state: ConfigModel;
  readonly setState: (cfg: Partial<ConfigModel>) => void;
  readonly tsVersions: readonly string[];
}

const MIN_TS_VERSION_SEMVER = '>=4.7.4';

function OptionsSelectorContent({
  state,
  setState,
  tsVersions,
}: OptionsSelectorParams): React.JSX.Element {
  const [copyLink, copyLinkToClipboard] = useClipboard(() =>
    document.location.toString(),
  );
  const [copyMarkdown, copyMarkdownToClipboard] = useClipboard(() =>
    createMarkdown(state),
  );

  const openIssue = useCallback(() => {
    const params = createMarkdownParams(state);

    window
      .open(
        `https://github.com/typescript-eslint/typescript-eslint/issues/new?${params}`,
        '_blank',
      )
      ?.focus();
  }, [state]);

  const tsVersionsFiltered = useMemo(
    () =>
      tsVersions.filter(version =>
        semverSatisfies(version, MIN_TS_VERSION_SEMVER),
      ),
    [tsVersions],
  );

  return (
    <>
      <Expander label="Info">
        <InputLabel name="TypeScript">
          <Dropdown
            name="ts"
            className="text--right"
            value={state.ts}
            disabled={!tsVersionsFiltered.length}
            onChange={(ts): void => setState({ ts })}
            options={
              tsVersionsFiltered.length ? tsVersionsFiltered : [state.ts]
            }
          />
        </InputLabel>
        <InputLabel name="Eslint">{process.env.ESLINT_VERSION}</InputLabel>
        <InputLabel name="TSESlint">{process.env.TS_ESLINT_VERSION}</InputLabel>
      </Expander>
      <Expander label="Options">
        <InputLabel name="File type">
          <Dropdown
            name="fileType"
            value={state.fileType}
            onChange={(fileType): void => setState({ fileType })}
            options={fileTypes}
          />
        </InputLabel>
        <InputLabel name="Source type">
          <Dropdown
            name="sourceType"
            value={state.sourceType}
            onChange={(sourceType): void => setState({ sourceType })}
            options={['script', 'module']}
          />
        </InputLabel>
        <InputLabel name="Auto scroll">
          <Checkbox
            name="enableScrolling"
            checked={state.scroll}
            onChange={(scroll): void => setState({ scroll })}
          />
        </InputLabel>
        <InputLabel name="Show tokens">
          <Checkbox
            name="showTokens"
            checked={state.showTokens}
            onChange={(showTokens): void => setState({ showTokens })}
          />
        </InputLabel>
      </Expander>
      <Expander label="Actions">
        <ActionLabel name="Copy link" onClick={copyLinkToClipboard}>
          <Tooltip open={copyLink} text="Copied">
            {copyLink ? (
              <SuccessIcon width="13.5" height="13.5" />
            ) : (
              <CopyIcon width="13.5" height="13.5" />
            )}
          </Tooltip>
        </ActionLabel>
        <ActionLabel name="Copy Markdown" onClick={copyMarkdownToClipboard}>
          <Tooltip open={copyMarkdown} text="Copied">
            {copyMarkdown ? (
              <SuccessIcon width="13.5" height="13.5" />
            ) : (
              <CopyIcon width="13.5" height="13.5" />
            )}
          </Tooltip>
        </ActionLabel>
        <ActionLabel name="Report as Issue" onClick={openIssue}>
          <IconExternalLink width="13.5" height="13.5" />
        </ActionLabel>
      </Expander>
    </>
  );
}

function OptionsSelector(props: OptionsSelectorParams): React.JSX.Element {
  const windowSize = useWindowSize();
  if (windowSize === 'mobile') {
    return (
      <NavbarSecondaryMenuFiller
        component={OptionsSelectorContent}
        props={props}
      />
    );
  }
  return <OptionsSelectorContent {...props} />;
}

export default OptionsSelector;
