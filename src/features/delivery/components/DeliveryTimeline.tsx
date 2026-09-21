import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
} from '@mui/lab'
import { Typography } from '@mui/material'
import type { DeliveryStatus, DeliveryTrackingEvent } from '@/types/delivery'
import { DELIVERY_STATUS_LABEL } from '../statusLabels'

function deliveryDotColor(status: DeliveryStatus) {
  return status === 'FAILED' ? 'error' : 'primary'
}

export function DeliveryTimeline({ events }: { events: DeliveryTrackingEvent[] }) {
  return (
    <Timeline>
      {events.map((event, index) => (
        <TimelineItem key={`${event.status}-${event.occurredAt}`}>
          <TimelineSeparator>
            <TimelineDot color={index === 0 ? deliveryDotColor(event.status) : 'grey'} />
            {index < events.length - 1 && <TimelineConnector />}
          </TimelineSeparator>
          <TimelineContent>
            <Typography variant="body2">{DELIVERY_STATUS_LABEL[event.status]}</Typography>
            <Typography variant="caption" color="text.secondary">
              {event.location} · {new Date(event.occurredAt).toLocaleString()}
            </Typography>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  )
}
