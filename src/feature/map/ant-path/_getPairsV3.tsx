import _ from 'lodash';
import { AntPathEvent } from './AntPath';
import { getFirstDate, getLastDate } from './path-maker';

function getPairsV3(): (
  value: AntPathEvent[]
) => {
  segment: [AntPathEvent, AntPathEvent];
  start: string;
  end: string;
  diff: number;
  reverse?: boolean | undefined;
}[] {
  return (events) => {
    const pairs = getPairs(
      // 1. get first element in a cluster
      _(events).sortBy(getFirstDate).sortedUniqBy('groupId').value(),
      // 2. get last element in a cluste
      _(events)
        .orderBy(getLastDate, 'desc')
        .sortedUniqBy('groupId')
        .reverse()
        .value()
    );
    const chens: {
      segment: [AntPathEvent, AntPathEvent];
      start: string;
      end: string;
      diff: number;
      reverse?: boolean;
    }[] = [];
    const createChen = (first: AntPathEvent, last: AntPathEvent) => {
      const start = getFirstDate(first);
      const end = getLastDate(last);
      return {
        segment: [first, last],
        start,
        end,
        diff: +end.slice(0, 4) - +start.slice(0, 4),
        reverse: end < start,
      };
    };
    for (let i = 1; i < pairs.length; i++) {
      const [chFirst, chLast] = pairs[i - 1];
      const [enFirst, enLast] = pairs[i];
      // three cases
      // case 1 :
      //
      // [|--] ch --| |-- en [--|]
      // case 2 :
      // |---- ch [----|]
      //        |--------- en [--------|]
      // case 3 :
      // |---- ch ----|
      //    |- en -|
      if (!chLast) {
        // either case 2 or 3
        // chens.push({
        //   segment: [chFirst!, enFirst]
        // })
      }
      if (chLast && enFirst) {
        const start = getLastDate(chLast);
        const end = getFirstDate(enFirst);
        if (start <= end) {
          chens.push({
            // case 1
            segment: [chLast, enFirst],
            start,
            end,
            diff: +end.slice(0, 4) - +start.slice(0, 4),
          });
        } else {
          chens.push({
            segment: [chLast, enFirst],
            start: end,
            end,
            diff: 0,
          });
        }
      }
    }
    return chens;
  };
}

// ! UNUSED
// _(clusterRef.current.getLayers())
//   .map(marker => {
//     let cluster = marker.__parent;
//     while (cluster._zoom === undefined || cluster._zoom > zoom) {
//       cluster = cluster.__parent;
//     }
//     return {
//       marker,
//       groupId: cluster._leaflet_id,
//       latLng: cluster.getLatLng()
//     };
//   })
//   .groupBy('groupId')
//   .mapValues(markers => ({
//     markers: _(markers)
//       .map('marker.options.id')
//       .value(),
//     id: markers[0].groupId,
//     latLng: markers[0].latLng
//   }))
//   .value()
function customZip([firsts, lasts]: [AntPathEvent, AntPathEvent][][]) {
  const fusion: {
    segment: [AntPathEvent, AntPathEvent];
    start: string;
    end: string;
    diff: number;
    reverse?: boolean;
  }[] = [];
  // fusion.push([aEnd, bStart]);
  // fusion.push({
  //   segment: [lastA, firstB],
  //   start: lastAdate,
  //   end: firstBate,
  //   diff: moment(firstBate).diff(lastAdate, 'year')
  // });
  console.groupEnd();
  return fusion;
}
function getCounts(
  firsts: AntPathEvent[],
  lasts: AntPathEvent[]
): {
  [k: string]: {
    f: number[];
    l: number[];
    offset: number;
  };
} {
  return _(firsts)
    .transform(
      (acc, v, index) => {
        (acc[v.groupId] || (acc[v.groupId] = [])).push(index);
      },
      {} as {
        [k: string]: number[];
      }
    )
    .mergeWith(
      _.transform(
        lasts,
        (acc, v, index) => {
          (acc[v.groupId] || (acc[v.groupId] = [])).push(index);
        },
        {} as {
          [k: string]: number[];
        }
      ),
      (f: number[], l: number[]) => ({
        f,
        l,
        offset: f.length - l.length,
      })
    )
    .value() as any;
}
function getPairs(
  firsts: AntPathEvent[],
  lasts: AntPathEvent[]
): [AntPathEvent | undefined, AntPathEvent | undefined][] {
  const counts = getCounts(firsts, lasts);
  const cpts = _.mapValues(counts, () => ({ count: 0, done: false }));
  const pairs: [AntPathEvent | undefined, AntPathEvent | undefined][] = [];
  for (let fi = 0, li = 0; fi < firsts.length || li < lasts.length; ) {
    let group;
    const first = firsts[fi];
    const last = lasts[li];
    if (!last || (first && getFirstDate(first) < getLastDate(last))) {
      group = first.groupId;
      fi++;
    } else {
      group = last.groupId;
      li++;
    }
    const cpt = cpts[group];
    if (cpt.done) {
      cpt.done = false;
      continue;
    }
    const { offset, f, l } = counts[group];
    if (offset >= 0) {
      let litem;
      if (offset <= cpt.count) {
        cpt.done = true;
        litem = lasts[l[cpt.count - offset]];
      }
      pairs.push([firsts[f[cpt.count]], litem]);
      cpt.count++;
    } else {
      let fitem;
      if (-offset > cpt.count) {
        cpt.done = true;
        fitem = firsts[f[cpt.count]];
      }
      pairs.push([fitem, lasts[l[cpt.count]]]);
      cpt.count++;
    }
  }
  return pairs;
}
