import React from "react";
import { ErrorMessage, Field, useField } from "formik";
import BootstrapForm from "react-bootstrap/Form";
import Datetime from "react-datetime";
import Col from "react-bootstrap/Col";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import moment from "moment";

interface Props {
  label: string;
  field: string;
  labelWidth?: number;
  placeHolder?: string;
  readOnly?: boolean;
  type?: "text" | "number";
  showhelp?: boolean;
  helptext?: string;
  isDate?: boolean;
  customClass?: string;
  size?: "sm" | "lg";
}

export const FormItem: React.FC<Props> = ({
  label,
  field,
  labelWidth = 2,
  placeHolder,
  readOnly = false,
  type = "text",
  showhelp,
  helptext = "",
  isDate,
  customClass,
  size = "sm",
}) => {
  const popover = <Tooltip id={label}>{helptext}</Tooltip>;

  return (
    <BootstrapForm.Row>
      <BootstrapForm.Group as={Col}>
        <BootstrapForm.Label style={{ paddingLeft: "0" }} column={true}>
          {label}{" "}
          {showhelp && (
            <OverlayTrigger placement="right" overlay={popover}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                style={{ marginLeft: "2px" }}
                fill="currentColor"
                className="bi bi-question-circle-fill"
                viewBox="0 0 16 16"
              >
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.496 6.033h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286a.237.237 0 0 0 .241.247zm2.325 6.443c.61 0 1.029-.394 1.029-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94 0 .533.425.927 1.01.927z" />
              </svg>
            </OverlayTrigger>
          )}
        </BootstrapForm.Label>
        <Col sm={12} xl={12} style={{ paddingLeft: "0" }}>
          <Field
            name={field}
            as={isDate ? DateComponent : CustomInputComponent}
            placeholder={placeHolder || label.toLowerCase()}
            readOnly={readOnly}
            type={type}
            helptext={helptext}
            className={customClass}
            size={size}
            showhelp={showhelp}
          />
          <ErrorMessage className="red" name={field} component="div" />
        </Col>
      </BootstrapForm.Group>
    </BootstrapForm.Row>
  );
};

const DateComponent = (props: any) => {
  const [, , helpers] = useField(props.name);
  const today = moment();

  const valid = (current: any) => {
    return current.isAfter(today);
  };
  const { setValue } = helpers;

  const handleOnChange = (e: any) => {
    if (e.unix) {
      setValue(e.unix());
    }
  };

  return (
    <Datetime
      utc={true}
      className="custom"
      onChange={handleOnChange}
      isValidDate={valid}
    />
  );
};

const CustomInputComponent = (props: Props) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <BootstrapForm.Control
        type="text"
        key="name"
        size={props.size}
        placeholder={props.field}
        {...props}
        style={{ marginRight: "10px" }}
      />
    </div>
  );
};
