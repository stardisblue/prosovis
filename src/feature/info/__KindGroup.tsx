import React, { useState, useEffect, useMemo } from 'react';
import classnames from 'classnames';
import { DeprecatedAnyEvent, Datation } from '../../data/models';
import { Flex, FlexItem } from '../../components/ui/Flex';
import { map } from 'lodash';
import { ChevronUpIcon, ChevronDownIcon } from '@primer/octicons-react';
import { DeprecatedThumbnailEventInfo } from './__EventInfo';
import { DeprecatedEventDates } from './__EventDates';
import { useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import { selectSwitchKindColor } from '../../selectors/switch';
import getEventIcon from '../../data/getEventIcon';
import useHoverHighlight from '../../hooks/useHoverHighlight';
import { useFlatClick } from '../../hooks/useClick';

const MarginLeftDiv = styled<any>('div')`
  border-color: ${(props: any) => props.borderColor};
  margin-left: 1rem;
`;

/**
 *
 * @param param0
 * @deprecated use EventGroup
 */
export const DeprecatedKindGroup: React.FC<{
  kind: DeprecatedAnyEvent['kind'];
  events: DeprecatedAnyEvent[];
  start: Datation;
  end: Datation;
  origin: 'Actor' | 'NamedPlace';
  selected?: boolean;
  masked?: boolean;
  highlighted?: boolean;
}> = function ({
  kind,
  events,
  start,
  end,
  origin,
  selected,
  masked,
  highlighted,
}) {
  const color = useSelector(selectSwitchKindColor);
  const [show, setShow] = useState(false);

  useEffect(() => setShow(selected === true), [selected]);
  const interactive = useMemo(
    () => map(events, ({ id }) => ({ id, kind: 'Event' })),
    [events]
  );

  const Icon = getEventIcon(kind);
  const Chevron = show ? ChevronUpIcon : ChevronDownIcon;
  return (
    <div className="pv1">
      <Flex
        justify="between"
        items="center"
        className={classnames('sip-info--event pointer', {
          b: selected,
          'o-50': masked,
          'bg-light-gray': highlighted,
        })}
        {...useFlatClick(() => setShow((s) => !s))}
        {...useHoverHighlight(interactive)}
      >
        <span className="ph2">
          <Icon iconColor={color ? color(kind) : 'black'} />
        </span>
        <FlexItem auto>
          {events.length} {getKindString(kind)}
        </FlexItem>
        <DeprecatedEventDates dates={[start, end]} />
        <Chevron
          className="ma1 flex-shrink-0"
          verticalAlign="text-bottom"
          aria-label={show ? 'Réduire' : 'Etendre'}
        />
      </Flex>
      {show && (
        <MarginLeftDiv
          className="bl bw1 pt1"
          borderColor={color ? color(kind) : 'grey'}
        >
          {map(events, (e) => (
            <DeprecatedThumbnailEventInfo
              key={e.id}
              event={e}
              origin={origin}
              icon={false}
            />
          ))}
        </MarginLeftDiv>
      )}
    </div>
  );
};

export default DeprecatedKindGroup;

/**
 *
 * @param kind
 * @deprecated
 */
function getKindString(kind: string) {
  switch (kind) {
    case 'Birth':
      return 'Naissances';

    case 'Death':
      return 'Décès';

    case 'Education':
      return 'Enseignements';

    case 'ObtainQualification':
      return 'Obtention de qualités';

    case 'PassageExamen':
      return 'Evaluations';

    case 'Retirement':
      return 'Départs en retraite';

    case 'SuspensionActivity':
      return "Suspensions d'activités";

    default: {
      return 'Inconnue';
    }
  }
}