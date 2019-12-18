import React from 'react';
import _ from 'lodash';
import { Datation, Actor } from '../models';

export function parseDates(dates: Datation[]) {
  return _(dates)
    .sortBy('clean_date')
    .map(date => date.value)
    .join(' - ');
}

/**
 *
 * @param param0
 * @deprecated
 */
export const ActorInfoBox: React.FC<{ actor: Actor }> = function({ actor }) {
  return (
    <div>
      {actor && (
        <>
          <h2>{actor.label}</h2>
          <table>
            <tbody>
              <tr>
                <th>URI: </th>
                <td>
                  <a href={actor.uri}>{actor.uri}</a>
                </td>
              </tr>
              <tr>
                <th>Label: </th>
                <td>
                  {actor.label} | {parseDates(actor.birth_set[0].datation)} --{' '}
                  {parseDates(actor.death_set[0].datation)}
                </td>
              </tr>
            </tbody>
          </table>
          <b>Enseignements :</b>
          <ul>
            {_.map(actor.education_set, education => {
              return (
                <li key={education.id}>
                  {parseDates(education.datation)}{' '}
                  {education.abstract_object && (
                    <i>{education.abstract_object.label} </i>
                  )}
                  à <b>{education.collective_actor.label}</b>
                </li>
              );
            })}
          </ul>
          <b>Passage Examens :</b>
          <ul>
            {_.map(actor.est_evalue_examen, examen => {
              return (
                <li key={examen.id}>
                  {parseDates(examen.datation)}{' '}
                  {examen.abstract_object && (
                    <i>{examen.abstract_object.label}</i>
                  )}{' '}
                  à <b>{examen.collective_actor.label}</b> par{' '}
                  {examen.actor_evaluer.label}
                </li>
              );
            })}
          </ul>
          <b>Evaluation Examens</b>
          <ul>
            {_.map(actor.evaluer_examen, examen => {
              return (
                <li key={examen.id}>
                  {parseDates(examen.datation)} {examen.actor_evalue.label} :{' '}
                  {examen.abstract_object && (
                    <i>{examen.abstract_object.label}</i>
                  )}{' '}
                  à <b>{examen.collective_actor.label}</b>
                </li>
              );
            })}
          </ul>
          <b>Obtentions</b>
          <ul>
            {_.map(actor.obtainqualification_set, q => {
              return (
                <li key={q.id}>
                  {parseDates(q.datation)}{' '}
                  {q.social_characteristic && (
                    <i>{q.social_characteristic.label}</i>
                  )}
                  {q.collective_actor && (
                    <>
                      {' '}
                      à <b>{q.collective_actor.label}</b>
                    </>
                  )}
                </li>
              );
            })}
          </ul>
          <b>Suspension d'activités</b>
          <ul>
            {_.map(actor.suspensionactivity_set, s => {
              return (
                <li key={s.id}>
                  {parseDates(s.datation)}{' '}
                  {s.abstract_object && <i>{s.abstract_object.label}</i>}
                </li>
              );
            })}
          </ul>
          {actor.retirement_set.length > 0 && (
            <b>Retraite : {parseDates(actor.retirement_set[0].datation)}</b>
          )}
        </>
      )}
    </div>
  );
};
