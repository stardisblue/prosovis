import React, { useCallback, useRef, useState } from 'react';
import { XIcon } from '@primer/octicons-react';
import styled from 'styled-components/macro';
import { Organisms } from '../../components/Organisms';
import { ScaledDownImg } from '../../components/ScaledDownImg';
import { StyledFlex } from '../../components/ui/Flex/styled-components';
import { IconSpacerPointer } from '../../components/ui/IconSpacer';
import { useDimsPopper } from '../../components/ui/Popper';
import { useFlatClick } from '../../hooks/useClick';
import Modal from '../modal/Modal';
import { QuestionButton } from './QuestionButton';
import { darkgray } from '../../v2/components/theme';

const AbsoluteDiv = styled.div`
  top: 0;
  z-index: 9999;
  width: 30em;
  padding: 0.25em;
  position: absolute;
  background-color: white;
  box-shadow: 1px 1px 5px 0 ${darkgray};
  border-radius: 3px;
  pointer-events: auto;
`;

const Head = styled.div`
  display: flex;
  justify-content: space-between;
`;
const TitleCloseIcon = styled(IconSpacerPointer)`
  align-self: start;
`;

const SquishedParagraph = styled.p`
  line-height: 1.2;
`;
const PaddedStyledFlex = styled(StyledFlex)`
  padding-top: 1em;
`;

export const HelpInfoBubble: React.FC<{ className?: string }> = function ({
  className,
}) {
  const $ref = useRef<HTMLDivElement>(null as any);
  const $content = useRef<HTMLDivElement>(null as any);
  const [dims, show, hide] = useDimsPopper($ref, $content, 'north-west');

  const [toggle, setToggle] = useState(true);

  const toggler = useCallback(() => {
    if (toggle) {
      show();
      setToggle(false);
    } else {
      hide();
      setToggle(true);
    }
  }, [toggle, show, hide]);

  const flatClick = useFlatClick(toggler);

  return (
    <div className={className}>
      <IconSpacerPointer ref={$ref} {...flatClick} style={{ color: darkgray }}>
        <QuestionButton />
      </IconSpacerPointer>

      <Modal>
        <AbsoluteDiv ref={$content} style={dims}>
          <Head>
            <h3>A propos du projet</h3>
            <TitleCloseIcon spaceRight {...flatClick}>
              <XIcon aria-label="Fermer le menu contextuel d'erreur" />
            </TitleCloseIcon>
          </Head>
          <Organisms />
          <PaddedStyledFlex>
            <a
              href="https://anr.fr/Projet-ANR-17-CE38-0013"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ScaledDownImg
                src="./img/anr-long.png"
                alt="Logo Agence Nationale de la Recherche"
              />
            </a>

            <SquishedParagraph>
              This research has been funded by a national French grant (
              <a
                href="https://anr.fr/Projet-ANR-17-CE38-0013"
                target="_blank"
                rel="noopener noreferrer"
              >
                ANR Daphne 17-CE28-0013-01
              </a>
              ).
            </SquishedParagraph>
          </PaddedStyledFlex>
          <SquishedParagraph>
            Sources :{' '}
            <a
              href="http://siprojuris.symogih.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              SIPROJURIS
            </a>
            . Point d'entrée :{' '}
            <a
              href="http://symogih.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              symogih.org
            </a>
            .
          </SquishedParagraph>
        </AbsoluteDiv>
      </Modal>
    </div>
  );
};
