import { Card, Flex } from "antd";
import "./styles.css";

interface IBaseStrategyInput {
  title: string;
  instrumentSelect: React.ReactNode;
  indicatorInput: React.ReactNode;
}

export const BaseStrategyInput = ({
  indicatorInput,
  instrumentSelect,
  title,
}: IBaseStrategyInput) => {
  return (
    <Card title={title} bordered={true}>
      <Flex vertical className="strategy-block" gap="large">
        <div className="strategy-block__indicator">{indicatorInput}</div>
        {instrumentSelect}
      </Flex>
    </Card>
  );
};
