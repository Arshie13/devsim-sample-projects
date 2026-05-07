import type { Stop } from "../../types/stop";

interface StopCardProps {
  stop: Stop;
  onVote?: () => void;
}

// L2-T1 BUG (intentional): StopCard returns null instead of rendering the stop.
//
// Fix: Replace the return null with JSX that renders:
//   - stop.title inside an <h3>
//   - stop.location as visible text
//   - stop.category as a <Badge> with data-testid="category-badge"
//   - formatDate(stop.dayDate) with data-testid="day-label"
//   - stop.voteCount with data-testid="vote-count"
//   - A <Button> with text "Vote" (accessible name must match /vote/i)
//     that calls onVote when clicked
//
// Import Card, Badge, Button from '../ui/' and formatDate from '../../utils/formatters'.
//
// Example structure:
// <Card>
//   <div>
//     <Badge data-testid="category-badge">{stop.category}</Badge>
//     <h3>{stop.title}</h3>
//     <p>{stop.location}</p>
//     <span data-testid="day-label">{formatDate(stop.dayDate)}</span>
//   </div>
//   <div>
//     <span data-testid="vote-count">{stop.voteCount}</span>
//     <Button onClick={onVote}>Vote</Button>
//   </div>
// </Card>
export function StopCard({ stop, onVote }: StopCardProps) {
  // L2-T1 BUG (intentional): returns null — implement the component
  return null;
}
