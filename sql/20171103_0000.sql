CREATE TABLE public.customer
(
  customer_id integer NOT NULL DEFAULT nextval('customer_customer_id_seq'::regclass),
  first_name character varying(100) NOT NULL,
  last_name character varying(100) NOT NULL,
  address character varying(256) NOT NULL,
  city character varying(100) NOT NULL,
  gender genderType NOT NULL  DEFAULT 'male'::genderType,
  customer_created timestamp without time zone NOT NULL DEFAULT now(),
  CONSTRAINT customer_id PRIMARY KEY (customer_id)
);

CREATE TYPE genderType AS ENUM ('male', 'female');

CREATE SEQUENCE customer_customer_id_seq START 1;

CREATE TABLE public.state
(
  state_id integer NOT NULL DEFAULT nextval('state_state_id_seq'::regclass),
  name character varying(100) NOT NULL,
  abbreviation character varying(10) NOT NULL,
  CONSTRAINT state_id PRIMARY KEY (state_id)
);

CREATE SEQUENCE state_state_id_seq START 1;
INSERT into state (name,abbreviation) VALUES ('Alabama', 'AL'), ('Alaska', 'AK'), ('Arizona', 'AZ'), ('Arkansas', 'AR'), ('California', 'CA'), ('Colorado', 'CO'), ('Connecticut', 'CT'), ('Delaware', 'DE')

CREATE TABLE public.item
(
  item_id integer NOT NULL DEFAULT nextval('item_item_id_seq'::regclass),
  name character varying(100) NOT NULL,
  item_price integer NOT NULL,
  CONSTRAINT item_id PRIMARY KEY (item_id)
);

CREATE SEQUENCE item_item_id_seq START 1;

INSERT into item (name, item_price) VALUES ('Basketball', 7), ('Hat', 6)

CREATE TABLE public.shipment
(
  shipment_id integer NOT NULL DEFAULT nextval('shipment_shipment_id_seq'::regclass),
  item_id integer NOT NULL,
  customer_id integer NOT NULL,
  qry integer NOT NULL,
  CONSTRAINT shipment_id PRIMARY KEY (shipment_id),
  CONSTRAINT item_item_id_fkey FOREIGN KEY (item_id)
  REFERENCES public.item (item_id) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT customer_customer_id_fkey FOREIGN KEY (customer_id)
  REFERENCES public.customer (customer_id) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE SEQUENCE shipment_shipment_id_seq START 1;

CREATE TABLE public.user
(
  user_id integer NOT NULL DEFAULT nextval('user_user_id_seq'::regclass),
  username character varying(100) NOT NULL,
  password character varying(100) NOT NULL,
  CONSTRAINT user_id PRIMARY KEY (user_id)
);

CREATE SEQUENCE user_user_id_seq START 1;
