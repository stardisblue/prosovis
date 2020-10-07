import React, { useState, useEffect } from 'react';
import styled from 'styled-components/macro';
import { IconSpacerPointer } from '../../components/ui/IconSpacer';
import { XIcon } from '@primer/octicons-react';
import { useFlatClick } from '../../hooks/useClick';
import { useSelector, useDispatch } from 'react-redux';
import { selectServerStatus } from '../../selectors/serverStatus';
import { pingServer } from '../../data/fetchActor';
import { setOnline, setOffline } from '../../reducers/serverStatusSlice';

const Fixed = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 10000;
  background-color: black;
  color: white;
  text-align: center;
  padding: 1em;
`;

const TitleCloseIcon = styled(IconSpacerPointer)`
  position: absolute;
  top: 1em;
  right: 1em;
`;

export const OfflineBanner: React.FC = function () {
  const dispatch = useDispatch();
  const online = useSelector(selectServerStatus);
  const [open, toggle] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      pingServer()
        .then(() => {
          dispatch(setOnline());
        })
        .catch(() => {
          dispatch(setOffline());
        });
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, [dispatch]);

  useEffect(() => {
    if (online) {
      toggle(false);
    } else {
      toggle(true);
    }
  }, [online]);

  const flatClick = useFlatClick(() => toggle(false));

  return open ? (
    <Fixed>
      <div>
        Le serveur distant n'as pas pu être joint, veuillez réessayer plus tard
        ou notifiez nous à chen@lirmm.fr
      </div>
      <TitleCloseIcon {...flatClick}>
        <XIcon aria-label="Fermer la bannière" />
      </TitleCloseIcon>
    </Fixed>
  ) : null;
};
