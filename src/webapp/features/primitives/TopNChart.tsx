import { Link } from "react-router-dom";
import { TopNSkeleton } from "./TopNSkeleton";
import { TopNTitle } from "./TopNTitle";
import { EmptyState, ErrorState, formatNumber } from "./";

type Item = {
  name: string;
  value: number;
};

type Props = {
  title: string | JSX.Element;
  items: Item[];
  keyLabel?: React.ReactNode;
  valueLabel?: React.ReactNode;
  renderRow?: (item: Item) => React.ReactNode;
  isLoading?: boolean;
  isError?: boolean;
  searchParamKey?: string;
};

const defaultRenderRow = (item: Item) => <>{item.name || <i>Empty</i>}</>;

export function TopNChart(props: Props) {
  const total = props.items.reduce((acc, item) => acc + item.value, 0);
  const renderRow = props.renderRow ?? defaultRenderRow;

  const content = props.isError ? (
    <ErrorState />
  ) : props.isLoading ? (
    <TopNSkeleton />
  ) : props.items.length === 0 ? (
    <EmptyState />
  ) : (
    <>
      <div className="flex w-full flex-row justify-between items-end">
        <div>
          {typeof props.title === "string" ? <TopNTitle>{props.title}</TopNTitle> : props.title}
          {props.keyLabel && (
            <div className="text-muted-foreground text-sm font-normal">{props.keyLabel}</div>
          )}
        </div>
        <div className="text-muted-foreground text-sm font-normal pr-1">{props.valueLabel}</div>
      </div>
      <div className="grid text-sm mt-2 max-h-[22rem] overflow-y-auto">
        {props.items.map((item) => (
          <TopNRow
            key={item.name}
            item={item}
            percentage={Math.round(item.value) / total}
            searchParamKey={props.searchParamKey}
          >
            <div className="px-2">{renderRow(item)}</div>
          </TopNRow>
        ))}
      </div>
    </>
  );

  return content;
}

type TopNRowProps = {
  item: Item;
  percentage: number;
  children: React.ReactNode;
  searchParamKey?: string;
};

function TopNRow(props: TopNRowProps) {
  const targetUrl = new URL(window.location.href);
  if (props.searchParamKey) {
    targetUrl.searchParams.set(props.searchParamKey, props.item.name);
  }

  const content = (
    <div className="flex items-center justify-between group py-2 relative">
      <div className="hidden group-hover:block group-hover:bg-accent absolute h-8 origin-left rounded w-full" />
      <div className="relative z-10 flex w-full max-w-[calc(100%-3rem)] items-center">
        <div
          className="absolute h-8 origin-left bg-primary-100 dark:bg-primary-900 rounded transition-all"
          style={{ width: `${Math.min(props.percentage, 1) * 100}%` }}
        />
        <div className="flex z-10">{props.children}</div>
      </div>
      <p className="text-sm pr-2 z-10">{formatNumber(props.item.value)}</p>
    </div>
  );

  if (targetUrl.toString() !== window.location.href) {
    return (
      <Link to={targetUrl.toString()} preventScrollReset={true}>
        {content}
      </Link>
    );
  }

  return content;
}