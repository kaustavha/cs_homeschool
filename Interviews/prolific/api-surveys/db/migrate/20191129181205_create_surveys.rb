class CreateSurveys < ActiveRecord::Migration[6.0]
  def change
    create_table :surveys do |t|
      t.string :survey_name
      t.integer :available_places
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
