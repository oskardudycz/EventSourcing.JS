import { EventStoreDBClient } from '@eventstore/db-client';
import { SnapshotEvent } from '..';
import { pipeResultAsync } from '../../../primitives/pipe';
import { Result, success } from '../../../primitives/result';
import {
  appendToStream,
  AppendResult,
  FAILED_TO_APPEND_EVENT,
} from '../../eventStoreDB/appending/appendToStream';

export async function appendSnapshotToTheSameStream<
  SnapshotStreamEvent extends SnapshotEvent
>(
  eventStore: EventStoreDBClient,
  snapshot: SnapshotStreamEvent,
  streamName: string
): Promise<Result<AppendResult, FAILED_TO_APPEND_EVENT>> {
  return pipeResultAsync(
    async () => await appendToStream(eventStore, streamName, [snapshot]),
    async (result) => {
      const { nextExpectedRevision: lastSnapshotVersion } = result;
      await eventStore.setStreamMetadata(streamName, {
        lastSnapshotVersion,
      });
      return success(result);
    }
  )();
}
